<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
  }

	/* scroll bar */
	/*::-webkit-scrollbar {
		width: 14px;
		height: 14px;
	}

	::-webkit-scrollbar-track,
	::-webkit-scrollbar-thumb {
		border-radius: 999px;
		border: 5px solid transparent;
	}

	::-webkit-scrollbar-track {
		box-shadow: 1px 1px 5px rgba(0,0,0,.2) inset;
	}

	::-webkit-scrollbar-thumb {
		min-height: 20px;
		background-clip: content-box;
		box-shadow: 0 0 0 5px rgba(93, 134, 165, 1) inset;
	}

	::-webkit-scrollbar-corner {
		background: transparent;
	}*/
</style>
