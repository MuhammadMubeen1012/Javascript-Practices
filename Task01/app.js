// node list of panels like an array, contain all panels and its properties
// A NodeList is a collection of document nodes (element nodes,
//  attribute nodes, and text nodes)
const panels = document.querySelectorAll('.panel');

panels.forEach((panel) => {
	panel.addEventListener('click', () => {
		removeActiveClasses();
		panel.classList.add('active');
	});
});

function removeActiveClasses() {
	panels.forEach((panel) => {
		panel.classList.remove('active');
	});
}
