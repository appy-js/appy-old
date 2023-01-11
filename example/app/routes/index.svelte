<script lang="ts">
  import Button from "$app/components/Button.svelte";
  import logo from "$app/assets/logo.png";
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

<Button>Home</Button>
<img src={logo} alt="Logo" />

<style>
  img {
    color: green;
  }
</style>
