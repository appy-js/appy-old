<script lang="ts">
  import Button from "$app/components/Button.svelte";
  import logo from "$app/assets/logo.png";

  const a: string = null;
</script>

<Button>{a}</Button>
<img src={logo} alt="Logo" />

<style>
  img {
    color: green;
  }
</style>
