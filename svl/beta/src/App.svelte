<script>
import Container from "./Container.svelte";

	import SideButton from "./SideButton.svelte";
</script>

<main>
	<Container flexDirection="column" width="50%">
		<SideButton text="Playlists" link="#"/>
		<SideButton text="Suspicious Dictionary" link="#"/>
		<SideButton text="Bubble Clicker" link="#"/>
		<SideButton text="Pong Man" link="#"/>
		<SideButton text="Toxic Man" link="#"/>
		<SideButton text="List Man" link="#"/>
		<SideButton text="Mine Man" link="#"/>
		<SideButton text="Kalendar" link="#"/>
	</Container>
</main>

<style>
	main{
		margin: 0;
		padding: 0;
	}
</style>