<script>
	import VideoRow from "./VideoRow.svelte";
	import Container from "./Container.svelte";
	import HeadDisplay from "./HeadDisplay.svelte";
	import TopButton from "./TopButton.svelte";

	import videoData from "./videoData";
	import Fa from 'svelte-fa/src/fa.svelte'
	import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
	import { flip } from 'svelte/animate';
	import { currentHighlighted } from './stores.js';
	import HeadSelection from "./HeadSelection.svelte";
	import HeadButton from "./HeadButton.svelte";

	let currentPlaylist = "";
	let currentSorting = "date";
	let isReverse = false;

	function FlipOrder() {isReverse = !isReverse;}
	$: currentVideos = SetSorting(currentPlaylist, currentSorting, isReverse);

	function SetSorting(playlist, sorting, isReverse) {
		$currentHighlighted = undefined;
		var vids;
		if(playlist == "") vids = videoData;
		else vids = videoData.filter(vid => vid.playlists.includes(playlist));
		switch(sorting){
			case "date":
				vids.sort((a, b) => b.date-a.date); break;
			case "title": 
				vids.sort((a, b) => a.name.localeCompare(b.name)); break;
			case "length":
				vids.sort((a, b) => b.length-a.length); break;
		}
		if(isReverse) vids.reverse();
		return vids;
	}
	console.log(videoData);
</script>

<main>
	<Container width="100%" flexDirection="column">
		<HeadDisplay />
		<Container width="80%" margin="0 auto" gap="1px" flexDirection="column">
			<Container flexGrow="1" flexDirection="row">
				<HeadSelection>
					<HeadButton isLabel><h1>Sort by</h1></HeadButton>
					<HeadButton on:click={_ => {currentSorting = "date"}}><h1>Date</h1></HeadButton>
					<HeadButton on:click={_ => {currentSorting = "title"}}><h1>Title</h1></HeadButton>
					<HeadButton on:click={_ => {currentSorting = "length"}}><h1>Length</h1></HeadButton>
					<HeadButton on:click={_ => {currentPlaylist = ""}}><h1>All</h1></HeadButton>
					<HeadButton on:click={_ => {currentPlaylist = "season_1"}}><h1>Season 1</h1></HeadButton>
					<HeadButton on:click={_ => {currentPlaylist = "season_2"}}><h1>Season 2</h1></HeadButton>
					<HeadButton on:click={FlipOrder}><Fa icon={isReverse == false ? faArrowUp : faArrowDown} size="1.2x"/></HeadButton>
					
				</HeadSelection>
			</Container>
			{#each currentVideos as vid , i (vid)}
				<div animate:flip="{{duration:dist => 18 * Math.sqrt(dist)}}">
					<VideoRow {...vid} isFliped={i%2==1}/>
				</div>
			{/each}
			
		</Container>
	</Container>
	<TopButton><Fa icon={faArrowUp} size="0.9x"/></TopButton>

	
</main>

<svelte:head>
	<style>
		@font-face {
		font-family: "Quantico";
		src: url('content/fonts/Quantico.eot?#iefix') format('embedded-opentype'),
			url('content/fonts/Quantico.woff') format('woff'),
			url('content/fonts/Quantico.ttf')  format('truetype'),
			url('content/fonts/Quantico.svg#svgFontName') format('svg');
		font-weight: normal;
		font-style: normal;
		}
		@font-face {
		font-family: "Aldo";
		src: url('content/fonts/AldotheApache.ttf')  format('truetype');
		font-weight: normal;
		font-style: normal;
		}
		:root{
			--c-background: #A8D0E6;
			--c-accent1: #F76C6C;
			--c-accent2: #F8E9A1;
			--c-background2: #2B7A78;
			--c-accent3: #374785;
			--c-accent3b: #24305E;
		}

		body{
			background-color: var(--c-background);
		}
	</style>
	<title>Fastmans</title>
</svelte:head>