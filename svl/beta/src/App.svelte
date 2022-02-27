<script>
	import Container from "./Container.svelte";
	import Navigation from "./Navigation.svelte";
	import SideButton from "./SideButton.svelte";
	import Title from './Title.svelte';
	import blogPosts from './blogPosts.js'
	import BlogPost from "./BlogPost.svelte";


	console.log(blogPosts);
</script>

<main>
	<Title text="Fast Mans" fontFamily="Sofia" fontSize="48px" margin="32px 0 0 0"/>
	<Container width="1200px" height="40px" margin="0 auto" backgroundColor="rgba(0,0,0,0.5)"> 
		<Navigation name="Blog" link="https://hominglesi.github.io/"/>
		<Navigation name="Peh" link="https://hominglesi.github.io/p/peh/index.html"/>
		<Navigation name="Tesic site" link="https://hominglesi.github.io/p/tesic/index.html"/>
		<Navigation name="Zvuci" link="https://hominglesi.github.io/p/zvuci/index.html"/>
		<Navigation name="Arhivirano" isDropDownList=true>
			<Container flexDirection="column">
				<Navigation name="Stari Sajt" link="https://hominglesi.github.io/p/old/index.html"/>
				<Navigation name="Web Dizajn" link="https://hominglesi.github.io/p/web_dizajn/index.html"/>
				<Navigation name="Hardver" link="https://hominglesi.github.io/p/hardver/index.html"/>
				<Navigation name="FastJam" link="https://hominglesi.github.io/p/jam/index.html"/>
				<Navigation name="Forest Shelter" link="https://hominglesi.github.io/p/forest_shelter/index.html"/>
			</Container>
		</Navigation>
		
	</Container>
	<Container width="1200px" margin="0 auto" height="10px"/> 
	<Container width="1200px" margin="0 auto 8px auto" backgroundColor="rgba(0,0,0,0.6)"> 
		<Container flexDirection="column" flexGrow="1" padding="20px">
			<Title text="Blog" fontFamily="Quantico" fontSize="42px" margin="0 0 16px 0"/>
			{#each blogPosts as post}
				<BlogPost {...post} />
			{/each}
		</Container>
		<Container flexDirection="column" width="450px" alignItems="center" gap="8px" padding="50px 0 0 0">
			<SideButton text="Playlists" link="https://hominglesi.github.io/p/playlists/index.html"/>
			<SideButton text="Suspicious Dictionary" link="https://hominglesi.github.io/p/dictionary/index.html"/>
			<SideButton text="Bubble Clicker" link="https://hominglesi.github.io/p/osu/index.html"/>
			<SideButton text="Pong Man" link="https://hominglesi.github.io/p/pong/index.html"/>
			<SideButton text="Toxic Man" link="https://hominglesi.github.io/p/toxic/index.html"/>
			<SideButton text="List Man" link="https://hominglesi.github.io/p/list/index.html"/>
			<SideButton text="Mine Man" link="https://hominglesi.github.io/p/mines/index.html"/>
			<SideButton text="Kalendar" link="https://hominglesi.github.io/p/kalendar/index.html"/>
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
			background: url("build/bg.jpg") no-repeat center center fixed;;
		}
	</style>
	<title>Fastmans</title>
</svelte:head>