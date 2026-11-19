// Get references to the counter and status message.
const count = document.getElementById('treat-count');
const message = document.getElementById('treat-message');
const notes = ['YUM! Treat delivered!','Tail wag detected!','More snacks, please!','Legendary snack moment!'];
let treats = 0;
const dog = document.querySelector('.hero img');
function launchFireworks(event) {
	const emojis = ['🐾', '🦴'];
	for (let i = 0; i < 20; i++) {
		const angle = (Math.PI * 2 * i) / 20;
		const distance = 70 + Math.random() * 100;
		const spark = document.createElement('span');
		spark.className = 'firework';
		spark.textContent = emojis[Math.floor(Math.random() * emojis.length)];
		spark.style.setProperty('--origin-x', `${event.clientX}px`);
		spark.style.setProperty('--origin-y', `${event.clientY}px`);
		spark.style.setProperty('--move-x', `${Math.cos(angle) * distance}px`);
		spark.style.setProperty('--move-y', `${Math.sin(angle) * distance}px`);
		spark.style.setProperty('--spin', `${Math.random() * 360 - 180}deg`);
		document.body.appendChild(spark);
		spark.addEventListener('animationend', () => spark.remove(), { once:true });
	}
}
dog.addEventListener('click', launchFireworks);
dog.addEventListener('keydown', event => {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		const rect = dog.getBoundingClientRect();
		launchFireworks({ clientX:rect.left + rect.width / 2, clientY:rect.top + rect.height / 2 });
	}
});
// Follow the pointer with a tiny copy of the dog and leave a fading trail.
const cursorDog = document.createElement('img');
cursorDog.src = 'images/dog.png';
cursorDog.alt = '';
cursorDog.className = 'cursor-dog';
document.body.appendChild(cursorDog);
let trailTimer = 0;
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
	document.addEventListener('mousemove', event => {
		cursorDog.style.left = `${event.clientX - 21}px`;
		cursorDog.style.top = `${event.clientY - 21}px`;
		if (event.timeStamp - trailTimer > 55) {
			trailTimer = event.timeStamp;
			const trail = document.createElement('img');
			trail.src = 'images/dog.png';
			trail.alt = '';
			trail.className = 'cursor-dog-trail';
			trail.style.left = `${event.clientX - 21}px`;
			trail.style.top = `${event.clientY - 21}px`;
			document.body.appendChild(trail);
			trail.addEventListener('animationend', () => trail.remove(), { once:true });
		}
	});
}
// Increment the treat total and cycle through status messages on each click.
document.getElementById('treat-button').addEventListener('click', () => {
	treats++;
	count.textContent = treats;
	message.textContent = notes[(treats - 1) % notes.length];
});
