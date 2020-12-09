let email = {}

const isValidEmailAddress = function(emailAddress) {
    // Basis manier om e-mailadres te checken.
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress);
};

const isEmpty = function(fieldValue) {
	return !fieldValue || !fieldValue.length;
};

const doubleCheckEmailAddress = function() {
	if (isValidEmailAddress(email.input.value)) {
		// Stop met dit veld in de gaten te houden; het is in orde.
		email.input.removeEventListener('input', doubleCheckEmailAddress);
		removeErrors(email);
	} else {
		// Stuk herhalende code.
		if (isEmpty(email.input.value)) {
			email.errorMessage.innerText = 'This field is required';
		} else {
			email.errorMessage.innerText = 'Invalid emailaddress';
		}
	}
};

const addErrors = function(formField) {
	formField.field.classList.add('has-error');
	formField.errorMessage.classList.add('is-visible');
};

const removeErrors = function(formField) {
	formField.field.classList.remove('has-error');
	formField.errorMessage.classList.remove('is-visible');
};

function handleFloatingLabel() {
    let input = document.querySelector('.js-floating-input'),
        label = document.querySelector('.js-floating-label');

    input.addEventListener('blur', function () {
        if (input.value) {
            label.classList.add('is-floating');
        } else {
            label.classList.remove('is-floating');
        }
    });
}

const getDOMElements = function() {
	email.label = document.querySelector('.js-email-label');
	email.errorMessage = email.label.querySelector('.js-email-error-message');
	email.input = document.querySelector('.js-email-input');
    email.field = document.querySelector('.js-email-field');

	signUpButton = document.querySelector('.js-sign-up-button');
};

const enableListeners = function() {
	email.input.addEventListener('blur', function() {
		if (!isValidEmailAddress(email.input.value)) {
			if (isEmpty(email.input.value)) {
				email.errorMessage.innerText = 'This field is required';
			} else {
				email.errorMessage.innerText = 'Invalid emailaddress';
			}

			addErrors(email);

			// Gebruik een named function (doubleCheckPassword), om die er weer af te kunnen halen. Dit vermijdt ook het dubbel toevoegen ervan.
			email.input.addEventListener('input', doubleCheckEmailAddress);
		}
    });
    
    signUpButton.addEventListener('click', function(e) {
		// We gaan de form zelf versturen wanneer nodig.
		e.preventDefault();

		if (isValidEmailAddress(email.input.value)) {
			// start animation
			signUpButton.classList.add("on-click");
			setTimeout(function(){
				// stop animation
				signUpButton.classList.remove("on-click");
	
				// add checkmark
				signUpButton.classList.add("validated");
				signUpButtonText = signUpButton.innerText;
				signUpButton.innerHTML = `<svg class="validated__symbol" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9 16.2l-3.5-3.5c-.39-.39-1.01-.39-1.4 0-.39.39-.39 1.01 0 1.4l4.19 4.19c.39.39 1.02.39 1.41 0L20.3 7.7c.39-.39.39-1.01 0-1.4-.39-.39-1.01-.39-1.4 0L9 16.2z"/></svg>`;

				// back to button
				setTimeout(function(){
					email.input.value = "";
					signUpButton.classList.remove("validated");
					signUpButton.innerText = signUpButtonText;
				}, 1000);
			}, 2500);

		} else {
			addErrors(email);
			email.input.addEventListener('input', doubleCheckEmailAddress);
		}
	});
};

document.addEventListener("DOMContentLoaded", function(){
    console.log("Script found!");

    handleFloatingLabel();
    getDOMElements();
    enableListeners();
});