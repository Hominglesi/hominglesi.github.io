<script>
	import VideoRow from "./VideoRow.svelte";
	import Container from "./Container.svelte";
	import HeadDisplay from "./HeadDisplay.svelte";
	import TopButton from "./TopButton.svelte";

	import Fa from 'svelte-fa/src/fa.svelte'
	import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
</script>

<main>
	<Container width="100%" flexDirection="column">
		<HeadDisplay />
		<Container width="80%" margin="0 auto" gap="1px" flexDirection="column">
			<VideoRow />
			<VideoRow />
			<VideoRow />
			<VideoRow />
			<VideoRow />
		</Container>
	</Container>
	<TopButton> <Fa icon={faArrowUp} size="0.9x"/> </TopButton>

	
</main>

<style>

</style>