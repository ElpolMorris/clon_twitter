//cantidad de inputs en formulario y detalles
const inputsLoginDetails = {
	inputs: [
		{
			"nameInput": "userOrEmail",
			"type": "text",
			"label": "Usuario o Correo"
		},
		{
			"nameInput": "password",
			"type": "password",
			"label": "Contraseña"
		},
	]
}
const inputsDetailsRegister = {
	inputs: [
		{
			nameInput: "Nombre completo",
			type: "text",
			label: "Nombre completo",
		},
		{
			nameInput: "email",
			type: "email",
			label: "Correo",
		},
		{
			nameInput: "User",
			type: "text",
			label: "Nombre de Usuario",
		},
		{
			nameInput: "password",
			type: "password",
			label: "Contraseña",
		},
	],
};

const dataRender = {
	inputs: [
		{	
			"textarea":"true",
			"nameInput": "Tweet",
			"type": "textarea",
			"label": "Escribe lo que piensas"
		}
	]
}

module.exports={
	inputsLoginDetails,
	inputsDetailsRegister,
	dataRender
}