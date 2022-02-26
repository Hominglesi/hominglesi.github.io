<script>
	import Container from "./Container.svelte";
import Navigation from "./Navigation.svelte";
	import SideButton from "./SideButton.svelte";
	import Title from './Title.svelte';
</script>

<main>
	<Title text="Fast Mans" />
	<Container width="1200px" height="40px" margin="0 auto" backgroundColor="rgba(0,0,0,0.5)"> 
		<Navigation name="Blog" link="#"/>
		<Navigation name="Arhivirano" isDropDownList=true>
			<Container flexDirection="column">
				<Navigation name="gas" link="#"/>
				<Navigation name="gas2" link="#"/>
			</Container>
		</Navigation>
		
	</Container>
	<Container width="1200px" margin="0 auto"> 
		<Container flexDirection="column" flexGrow="1">
			<Title text="Blog" />
		</Container>
		<Container flexDirection="column" width="450px" alignItems="center">
			<SideButton text="Playlists" link="#"/>
			<SideButton text="Suspicious Dictionary" link="#"/>
			<SideButton text="Bubble Clicker" link="#"/>
			<SideButton text="Pong Man" link="#"/>
			<SideButton text="Toxic Man" link="#"/>
			<SideButton text="List Man" link="#"/>
			<SideButton text="Mine Man" link="#"/>
			<SideButton text="Kalendar" link="#"/>
		</Container>
	</Container>
	
</main>

<style>
	main{
		margin: 0;
		padding: 0;
	}
</style>