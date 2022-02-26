<script>
	import Container from "./Container.svelte";
	import Navigation from "./Navigation.svelte";
	import SideButton from "./SideButton.svelte";
	import Title from './Title.svelte';
</script>

<main>
	<Title text="Fast Mans" fontFamily="Sofia" fontSize="48px" margin="32px 0 0 0"/>
	<Container width="1200px" height="40px" margin="0 auto" backgroundColor="rgba(0,0,0,0.5)"> 
		<Navigation name="Blog" link="#"/>
		<Navigation name="Arhivirano" isDropDownList=true>
			<Container flexDirection="column">
				<Navigation name="gas" link="#"/>
				<Navigation name="gas2" link="#"/>
			</Container>
		</Navigation>
		
	</Container>
	<Container width="1200px" margin="0 auto" height="10px"/> 
	<Container width="1200px" margin="0 auto" backgroundColor="rgba(0,0,0,0.6)"> 
		<Container flexDirection="column" flexGrow="1">
			<Title text="Blog" fontFamily="Quantico" fontSize="42px" margin="16px 0 0 0"/>
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

<svelte:head>
	<style>
		@font-face {
		font-family: "Quantico";
		src: url('build/fonts/Quantico.eot?#iefix') format('embedded-opentype'),
			url('build/fonts/Quantico.woff') format('woff'),
			url('build/fonts/Quantico.ttf')  format('truetype'),
			url('build/fonts/Quantico.svg#svgFontName') format('svg');
		font-weight: normal;
		font-style: normal;
		}

		@font-face {
			font-family: "Sofia";
			src: url('build/fonts/Sofia.eot?#iefix') format('embedded-opentype'),
				url('build/fonts/Sofia.woff') format('woff'),
				url('build/fonts/Sofia.ttf')  format('truetype'),
				url('build/fonts/Sofia.svg#svgFontName') format('svg');
			font-weight: normal;
			font-style: normal;
		}
		body{
			background: url("bg.jpg") no-repeat center center fixed;;
		}
	</style>
</svelte:head>