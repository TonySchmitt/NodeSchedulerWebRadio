<?php

	/**
	 * Class Form
	 *	Allow to generate fastly a form
	 */

	class Form{

		/*
		 * @var array data use by the form
		 */
		protected $data;

		/*
		 * @var string Tag use to surround field
		 */
		public $surround = 'p';

		/*
		 * @param array $data data use by the form
		 *
		 */
		public function __construct($data = array()) {
			$this->data = $data;
		}

		/*
		 * @param $html string html to surround
		 * @return string
		 */
		protected function surround($html) {
			return "<{$this->surround}>$html</{$this->surround}>";
		}

		/*
		 * @param $index string index value to retrieve
		 * @return string
		 */
		protected  function getValue($index) {
			return isset ($this->data[$index]) ? $this->data[$index] : '';
		}

		/*
		 * @param $name string
		 * @return string
		 */
		public function input($name, $label, $options = []) {
			$type = isset($options["type"]) ? $options["type"] : 'text';
			$placeholder = isset($options["placeholder"]) ? $options["placeholder"] : '';
			$addon = $type == "mail" ? '<div class="input-group"><span class="input-group-addon" id="basic-addon1">@</span>' : '';
			$addonEnd = $type == "mail" ? '</div>' : '';
			$required = isset($options["required"]) ? $options["required"] : '';
			$pattern = isset($options["pattern"]) ? ' pattern="'.$options["pattern"].'" ' : '';
			$title = isset($options["pattern_title"]) ? ' title="'.$options["pattern_title"].'" ' : '';


			if($type == "textarea") {
				return $this->surround('<label for="'.$name.'">' . $label . '</label><textarea class="form-control" id="'.$name.'" name="'.$name.'" placeholder="' . $placeholder . '" '.$required.'>'. $this->getValue($name) .'</textarea>');
			} else if ($type == "hidden") {
				return $this->surround($addon . '<input id="'.$name.'" type="' . $type . '" class="form-control" name="'.$name.'" value="'. $this->getValue($name) .'" placeholder="' . $placeholder . '" '.$required.$pattern.$title.' >' . $addonEnd);
			}
			return $this->surround('<label for="'.$name.'">' . $label . '</label>' . $addon . '<input id="'.$name.'" type="' . $type . '" class="form-control" name="'.$name.'" value="'. $this->getValue($name) .'" placeholder="' . $placeholder . '" '.$required.$pattern.$title.' >' . $addonEnd);
		}

		public function select($name, $label, $data) {
			$val = $this->getValue($name);
			$return = '<label for="'.$name.'">' . $label . '</label><select id="'.$name.'" class="form-control" name="'.$name.'" >';
			foreach ($data as $key => $value) {
				$return .= '<option value="'.$value.'"';
				if($val == $value) {
					$return .= ' selected ';
				}
				$return .= '>'.$key.'</option>';
			}
			$return .= '</select>';
			return $this->surround($return);
		}


		/*
		 * @return string
		 */
		public function submit() {
			return $this->surround('<button type="submit">Envoyer</button>');
		}

	}
