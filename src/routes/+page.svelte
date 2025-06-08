<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	let timer = null;
	let timeLeft = 1 * 60; // 1 minute in seconds for demo
	let totalTime = 1 * 60;
	let isRunning = false;
	let savedTrees = [];

	// Reactive statements
	$: minutes = Math.floor(timeLeft / 60);
	$: seconds = timeLeft % 60;
	$: timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	$: progress = ((totalTime - timeLeft) / totalTime) * 100;
	$: motivationText = getMotivationText(savedTrees.length);

	function getMotivationText(treeCount) {
		if (treeCount === 0) {
			return "Start your first focus session to plant your first tree!";
		} else if (treeCount === 1) {
			return "Great start! Your forest is beginning to grow. Keep focusing!";
		} else if (treeCount < 5) {
			return `${treeCount} trees planted! Your forest is taking shape.`;
		} else {
			return `Amazing! You've grown ${treeCount} trees. Your focus forest is thriving!`;
		}
	}

	function updatePlantGrowth(progress) {
		const plant = document.getElementById('currentPlant');
		if (!plant) return;
		
		if (progress > 15) {
			plant.classList.add('growing');
		}
		if (progress > 70) {
			plant.classList.add('fully-grown');
		}
	}

	function startTimer() {
		if (!isRunning) {
			isRunning = true;
			timer = setInterval(() => {
				timeLeft--;
				updatePlantGrowth(progress);
				
				if (timeLeft <= 0) {
					completeSession();
				}
			}, 1000);
		}
	}

	function pauseTimer() {
		isRunning = false;
		if (timer) {
			clearInterval(timer);
		}
	}

	function stopTimer() {
		isRunning = false;
		if (timer) {
			clearInterval(timer);
		}
		
		// Plant dies animation
		const plant = document.getElementById('currentPlant');
		if (plant) {
			plant.classList.add('dying');
		}
		
		// Reset after animation
		setTimeout(() => {
			resetSession();
		}, 2000);
	}

	function completeSession() {
		isRunning = false;
		if (timer) {
			clearInterval(timer);
		}
		
		// Save the completed tree
		const newTree = {
			date: new Date().toISOString(),
			duration: totalTime,
			completed: true
		};
		savedTrees = [...savedTrees, newTree];
		
		if (browser) {
			localStorage.setItem('focusTrees', JSON.stringify(savedTrees));
		}
		
		// Show completion message
		alert('🌱 Congratulations! Your tree has been planted in the forest!');
		
		// Reset after a short delay to show the completed plant
		setTimeout(() => {
			resetSession();
		}, 2000);
	}

	function resetSession() {
		timeLeft = 1 * 60; // Reset to 1 minute
		totalTime = 1 * 60;
		const plant = document.getElementById('currentPlant');
		if (plant) {
			plant.className = 'plant';
		}
	}

	onMount(() => {
		if (browser) {
			savedTrees = JSON.parse(localStorage.getItem('focusTrees') || '[]');
		}
	});

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
	});
</script>

<svelte:head>
	<title>Focus Forest</title>
	<meta name="description" content="Grow your focus, grow your forest" />
</svelte:head>

<div class="background-container">
	<div class="animated-bg"></div>
	<div class="floating-particles">
		<div class="particle"></div>
		<div class="particle"></div>
		<div class="particle"></div>
		<div class="particle"></div>
	</div>
</div>

<div class="main-container">
	<div class="header">
		<h1>Focus Forest</h1>
		<p>Grow your focus, grow your forest</p>
	</div>

	<div class="content-grid">
		<div class="timer-section">
			<div class="timer-display">
				<h2>{timerDisplay}</h2>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {progress}%"></div>
				</div>
			</div>
			<div class="controls">
				<button class="btn primary" on:click={startTimer}>Start Focus</button>
				<button class="btn" on:click={pauseTimer}>Pause</button>
				<button class="btn danger" on:click={stopTimer}>Quit</button>
			</div>
		</div>

		<div class="plant-section">
			<div class="plant-container">
				<div class="ground"></div>
				<div class="plant" id="currentPlant">
					<div class="stem">
						<div class="leaf left"></div>
						<div class="leaf right"></div>
						<div class="flower"></div>
					</div>
				</div>
			</div>

			<div class="forest-preview">
				<h3>Your Growing Forest</h3>
				<div class="mini-trees">
					{#each savedTrees as tree, index}
						<div class="mini-tree" title="Tree {index + 1} - {new Date(tree.date).toLocaleDateString()}"></div>
					{/each}
				</div>
				<p class="motivation-text">{motivationText}</p>
			</div>
		</div>
	</div>
</div>

<style>
	:global(*) {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}

	:global(body) {
		font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
		overflow-x: hidden;
	}

	.background-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}

	.animated-bg {
		position: absolute;
		width: 100%;
		height: 100%;
		background: 
			radial-gradient(circle at 20% 80%, rgba(120, 200, 180, 0.1) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
			radial-gradient(circle at 40% 40%, rgba(120, 180, 255, 0.08) 0%, transparent 50%),
			linear-gradient(135deg, 
				#1e3c72 0%, 
				#2a5298 25%, 
				#4a90e2 50%, 
				#7bb3f0 75%, 
				#a8d8f0 100%
			);
		animation: backgroundShift 20s ease-in-out infinite;
	}

	@keyframes backgroundShift {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.8; }
	}

	.floating-particles {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.particle {
		position: absolute;
		background: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		animation: float 8s ease-in-out infinite;
	}

	.particle:nth-child(1) { width: 4px; height: 4px; left: 10%; animation-delay: 0s; }
	.particle:nth-child(2) { width: 6px; height: 6px; left: 20%; animation-delay: 2s; }
	.particle:nth-child(3) { width: 3px; height: 3px; left: 70%; animation-delay: 4s; }
	.particle:nth-child(4) { width: 5px; height: 5px; left: 80%; animation-delay: 6s; }

	@keyframes float {
		0%, 100% { transform: translateY(100vh) translateX(0px); opacity: 0; }
		10% { opacity: 1; }
		90% { opacity: 1; }
		100% { transform: translateY(-100px) translateX(20px); opacity: 0; }
	}

	.main-container {
		position: relative;
		z-index: 1;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 2rem;
		backdrop-filter: blur(20px);
		background: rgba(255, 255, 255, 0.05);
	}

	.header {
		text-align: center;
		margin-bottom: 3rem;
	}

	.header h1 {
		color: white;
		font-size: 2.5rem;
		font-weight: 300;
		margin-bottom: 0.5rem;
		text-shadow: 0 2px 20px rgba(0,0,0,0.3);
	}

	.header p {
		color: rgba(255, 255, 255, 0.8);
		font-size: 1.1rem;
		font-weight: 300;
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 4rem;
		max-width: 1200px;
		margin: 0 auto;
		flex: 1;
	}

	.timer-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.timer-display {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		padding: 3rem;
		text-align: center;
		margin-bottom: 2rem;
		box-shadow: 0 8px 32px rgba(0,0,0,0.1);
	}

	.timer-display h2 {
		color: white;
		font-size: 4rem;
		font-weight: 200;
		margin-bottom: 1rem;
		font-family: 'Monaco', monospace;
	}

	.controls {
		display: flex;
		gap: 1rem;
	}

	.btn {
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: white;
		padding: 1rem 2rem;
		border-radius: 50px;
		cursor: pointer;
		transition: all 0.3s ease;
		font-size: 1rem;
		font-weight: 500;
	}

	.btn:hover {
		background: rgba(255, 255, 255, 0.25);
		transform: translateY(-2px);
		box-shadow: 0 10px 25px rgba(0,0,0,0.2);
	}

	.btn.primary {
		background: linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%);
		border: none;
	}

	.btn.danger {
		background: linear-gradient(135deg, #ff6b6b 0%, #ffa726 100%);
		border: none;
	}

	.plant-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.plant-container {
		position: relative;
		width: 300px;
		height: 400px;
		margin-bottom: 2rem;
	}

	.ground {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 60px;
		background: linear-gradient(to bottom, #8B4513, #654321);
		border-radius: 10px;
		border: 2px solid rgba(255, 255, 255, 0.1);
	}

	:global(.plant) {
		position: absolute;
		bottom: 50px;
		left: 50%;
		transform: translateX(-50%);
		transform-origin: bottom center;
	}

	:global(.stem) {
		width: 6px;
		height: 0;
		background: linear-gradient(to top, #228B22, #32CD32);
		margin: 0 auto;
		border-radius: 3px;
		transition: height 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		position: relative;
	}

	:global(.leaf) {
		position: absolute;
		width: 20px;
		height: 15px;
		background: linear-gradient(45deg, #228B22, #90EE90);
		border-radius: 0 100% 0 100%;
		opacity: 0;
		transition: all 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
		transform: scale(0);
	}

	:global(.leaf.left) {
		left: -15px;
		top: 30%;
		transform: rotate(-45deg) scale(0);
	}

	:global(.leaf.right) {
		right: -15px;
		top: 60%;
		transform: rotate(45deg) scale(0);
	}

	:global(.flower) {
		position: absolute;
		top: -15px;
		left: 50%;
		transform: translateX(-50%) scale(0);
		width: 25px;
		height: 25px;
		background: radial-gradient(circle, #FFD700, #FFA500);
		border-radius: 50%;
		opacity: 0;
		transition: all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	:global(.flower::before) {
		content: '';
		position: absolute;
		top: -5px;
		left: -5px;
		width: 35px;
		height: 35px;
		background: radial-gradient(circle, rgba(255, 105, 180, 0.6), transparent);
		border-radius: 50%;
	}

	:global(.plant.growing .stem) {
		height: 150px;
	}

	:global(.plant.growing .leaf) {
		opacity: 1;
		transform: scale(1);
	}

	:global(.plant.growing .leaf.left) {
		transform: rotate(-45deg) scale(1);
	}

	:global(.plant.growing .leaf.right) {
		transform: rotate(45deg) scale(1);
	}

	:global(.plant.fully-grown .flower) {
		opacity: 1;
		transform: translateX(-50%) scale(1);
	}

	:global(.plant.dying) {
		animation: wither 2s ease-in-out;
	}

	@keyframes wither {
		0% { transform: translateX(-50%) scale(1); filter: saturate(1); }
		100% { transform: translateX(-50%) scale(0.8); filter: saturate(0) brightness(0.5); }
	}

	.forest-preview {
		background: rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(20px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 15px;
		padding: 1.5rem;
		margin-top: 2rem;
		text-align: center;
	}

	.forest-preview h3 {
		color: white;
		margin-bottom: 1rem;
		font-weight: 300;
	}

	.mini-trees {
		display: flex;
		justify-content: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	.mini-tree {
		width: 30px;
		height: 40px;
		background: linear-gradient(to top, #8B4513, #228B22);
		border-radius: 15px 15px 0 0;
		position: relative;
		opacity: 0.7;
		transition: opacity 0.3s ease;
	}

	.mini-tree:hover {
		opacity: 1;
	}

	.mini-tree::before {
		content: '';
		position: absolute;
		top: -5px;
		left: 50%;
		transform: translateX(-50%);
		width: 8px;
		height: 8px;
		background: #FFD700;
		border-radius: 50%;
	}

	.motivation-text {
		color: rgba(255, 255, 255, 0.9);
		font-style: italic;
		margin-top: 1rem;
		font-size: 0.95rem;
	}

	.progress-bar {
		width: 100%;
		height: 8px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 4px;
		margin-top: 1rem;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #00c9ff, #92fe9d);
		width: 0%;
		transition: width 0.3s ease;
		border-radius: 4px;
	}

	@media (max-width: 768px) {
		.content-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}
		
		.header h1 {
			font-size: 2rem;
		}
		
		.timer-display h2 {
			font-size: 3rem;
		}
	}
</style>