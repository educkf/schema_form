var form_squema = [
	{
		"type": "text",
		"name": "text_field",
		"id": "text_field",
		"class": "text_field",
		"label": "Text field",
		"placeholder": "Placeholder for text field"
	},
	{
		"type": "select",
		"name": "select_field",
		"id": "select_field",
		"class": "select_field",
		"label": "Select field",
		"options": {
			"0":"Option 0",
			"1":"Disable checkbox item",
			"2":"Show hidden select field"
		}
	},
	{
		"type": "select",
		"name": "conditional_select",
		"id": "conditional_select",
		"class": "conditional_select",
		"label": "Conditional Select",
		"options": {
			"0":"Option 0",
			"1":"Option 1",
			"2":"Options 2"
		},
		"visibility": 'hidden',
		"condition": [
			{
				"bindtype": "toggle_class",
				"bindto": "select_field",
				"bindvalue": ["2"],
				"bindstart": "hidden",
				"bindevent": "visible"
			}
		]
	},
	{
		"type": "textarea",
		"name": "textarea_field",
		"id": "textarea_field",
		"class": "textarea_field",
		"label": "Textarea field",
		"placeholder": "Placeholder for textarea"
	},
	{
		"type": "checkbox",
		"name": "checkbox_field",
		"id": "checkbox_field",
		"class": "checkbox_field",
		"label": "Checkbox field",
		"options": [
			{
				"value":"01",
				"label":"checkbox 1"
			},
			{
				"value":"01",
				"label":"checkbox 1"
			},
			{
				"value":"03",
				"label":"Lata (25 L)",
				"condition": [
					{
						"bindtype": "form_state",
						"bindto": "select_field",
						"bindvalue": ["1"],
						"bindstart": true,
						"bindevent": false
					}
				]
			}
		],
		"condition": [
			{
				"bindtype": "child_state"
			}
		]
	},
	{
		"type": "number",
		"name": "number_field",
		"id": "number_field",
		"class": "number_field",
		"label": "Number field",
		"placeholder": ""
	},
	{
		"type": "submit",
		"name": "submit_field",
		"id": "submit_field",
		"class": "btn btn-primary",
		"value": "Submit button"
	}
]

var container = $('#app');

for(i = 0; i < form_squema.length; i++) {
	var item = form_squema[i];

	var fieldId = getRandomInt();
	var visibility = item.visibility ? item.visibility : '';

	$('<div />').attr({
		'id': 'id-'+fieldId,
		'class': 'form-group ' + visibility
	}).appendTo($(container));


	if(item.label && item.label != ''){
		$('<label>')
			.attr('for',item.id)
			.text(item.label)
			.appendTo($('#id-' + fieldId));
	}

	//check type of field
	if (item.type == 'text' || item.type == 'password' || item.type == 'email' || item.type == 'number') {

		$('<input />')
			.attr({
				'name':item.name,
				'class': 'form-control ' + item.class,
				'id':item.id,
				'type':item.type
			}).appendTo($('#id-' + fieldId));



	} else if (item.type == 'textarea') {

		$('<textarea></textarea>')
			.attr({
				'name':item.name,
				'class': 'form-control ' + item.class,
				'id':item.id,
				'placeholder':item.placeholder
			}).appendTo($('#id-' + fieldId));



	} else if (item.type == 'select') {

		$('<select />')
			.attr({
				'name':item.name,
				'class': 'form-control ' + item.class,
				'id':item.id
			}).appendTo($('#id-' + fieldId));

		var options = item.options;

		for(var option in options) {
			$("#"+item.id).append('<option value="' + option + '">' + options[option] + '</option>');
		}
	} else if (item.type == 'checkbox') {

		$('<div />')
			.attr({
				'id':item.id
			}).appendTo($('#id-' + fieldId));

		var options = item.options;

		for(k = 0; k < options.length; k++) {
			$("#"+item.id).append('<div class="checkbox"><label><input type="checkbox" name="' + item.id + '" id="' + item.id + '_' + options[k].value + '" value="' + options[k].value + '" />' + options[k].label + '</label></div>');
		}
	} else if (item.type == 'submit') {

		$('<input />')
			.attr({
				'name':item.name,
				'class': 'form-control ' + item.class,
				'id':item.id,
				'type':item.type,
				'value':item.value
			}).appendTo($('#id-' + fieldId));
	}
	
} 

$(container).on('change', 'input, select, textarea', function() {

	var thisId = $(this).attr('name');
	var thisValue = $(this).val();

	for(i = 0; i < form_squema.length; i++) {

		if(form_squema[i].hasOwnProperty('condition')){

			for(k = 0; k < form_squema[i].condition.length; k++) {

				var found = $.inArray(thisValue, form_squema[i].condition[k].bindvalue) > -1;
				
				//caso seja um checkbox, ele verifica se está checado, para barrar depois
				if($(this).is(':checkbox') && $(this).is(':checked')) {
					var isChecked = true;
				} else if ($(this).is(':checkbox')) {
					var isChecked = false;
				} else {
					var isChecked = true;
				}

				if (form_squema[i].condition[k].bindtype == 'toggle_class') {

					//se tiver vinculo geral, com aquele elemento específico e, caso for um checkbox, estiver checkado...
					if (form_squema[i].condition[k].bindto == thisId && found && isChecked) {
						$('#'+form_squema[i].id).parent('.form-group').removeClass(form_squema[i].condition[k].bindstart).addClass(form_squema[i].condition[k].bindevent);
					} else if (form_squema[i].condition[k].bindto == thisId) {
						$('#'+form_squema[i].id).parent('.form-group').addClass(form_squema[i].condition[k].bindstart).removeClass(form_squema[i].condition[k].bindevent);
					}

				} else if (form_squema[i].condition[k].bindtype == 'form_state') {

					if (form_squema[i].condition[k].bindto == thisId &&  found ) {
						$('#'+form_squema[i].id).prop('disabled', form_squema[i].condition[k].bindstart);
					} else {
						$('#'+form_squema[i].id).prop('disabled', form_squema[i].condition[k].bindevent);
					}

				} else if (form_squema[i].condition[k].bindtype == 'child_state') {

					for(j = 0; j < form_squema[i].options.length; j++) {

						if (form_squema[i].options[j].condition) {

							for(l = 0; l < form_squema[i].options[j].condition.length; l++) {

								var subfound = $.inArray(thisValue, form_squema[i].options[j].condition[l].bindvalue) > -1;

								if (form_squema[i].options[j].condition[l].bindto == thisId && subfound ) {
									$('#'+form_squema[i].id+'_'+form_squema[i].options[j].value).prop({
										'disabled': form_squema[i].options[j].condition[l].bindstart,
										'checked': false
									});
								} else if (form_squema[i].options[j].condition[l].bindto == thisId) {
									$('#'+form_squema[i].id+'_'+form_squema[i].options[j].value).prop({
										'disabled': form_squema[i].options[j].condition[l].bindevent,
										'checked': false
									});
								} else {

								}

							}
						}
					}						

				}
			
			}
		};

	};

});

var formField = function() {

}

function getRandomInt() {
  min = Math.ceil(5000);
  max = Math.floor(10000);
  return Math.floor(Math.random() * (max - min)) + min;
}