<script lang="ts">
  import Button from "$app/components/Button.svelte";
  import logo from "$app/assets/logo.png";

  const str: string = "Increment";
</script>

<svelte:head>
  <title>Team Members</title>
</svelte:head>

<Button on:click={() => console.log("clicked")}>{str}</Button>

<button class="bg:primary" on:click={() => console.log("clicked")}>
  Click me
</button>

<img src={logo} alt="Logo" />

<style>
  img {
    color: green;
  }
</style>
