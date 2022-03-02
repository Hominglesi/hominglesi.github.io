<script>
	import VideoRow from "./VideoRow.svelte";
	import Container from "./Container.svelte";
	import HeadDisplay from "./HeadDisplay.svelte";
	import TopButton from "./TopButton.svelte";

	import videoData from "./videoData";
	import Fa from 'svelte-fa/src/fa.svelte'
	import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
	import HeadSelection from "./HeadSelection.svelte";
import HeadButton from "./HeadButton.svelte";

	let currentPlaylist = "season_2";
	$: currentVideos = SetPlaylist(currentPlaylist);

	function SetPlaylist(playlist) {
		return videoData.filter(vid => vid.playlists.includes(playlist));
	}
</script>

<main>
	<Container width="100%" flexDirection="column">
		<HeadDisplay />
		<Container width="80%" margin="0 auto" gap="1px" flexDirection="column">
			<HeadSelection>
				<HeadButton><Fa icon={faArrowUp} size="1.2x"/></HeadButton>
				<HeadButton isRight=true><h1>how</h1></HeadButton>
			</HeadSelection>
			{#each videoData as vid, i}
				<VideoRow {...vid} />
			{/each}
			
		</Container>
	</Container>
	<TopButton><Fa icon={faArrowUp} size="0.9x"/></TopButton>

	
</main>

<style>

</style>