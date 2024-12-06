<script lang="ts">
  let { title, children } = $props();
</script>

<fieldset>
  <legend>{title}</legend>
  <div class="example">
    {@render children?.()}
  </div>
</fieldset>

<style>
  fieldset {
    width: 50%;
    margin-bottom: 1rem;
  }

  legend {
    font-family: monospace;
    font-size: 16px;
    padding: 10px;
  }

  .example {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
