<script lang="ts">
  import { Button } from "../../../src/ui";
  import logo from "$app/assets/logo.png";
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<Button on:click={() => console.log("clicked")}>Home</Button>
<img src={logo} alt="Logo" />

<style>
  img {
    color: green;
  }
</style>
