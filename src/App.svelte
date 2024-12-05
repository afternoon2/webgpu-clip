<script lang="ts">
</script>

<div class="container">
  <header>
    <h1>Line & Polyline Clipping With Compute Shaders</h1>
    <hr />
  </header>
  <main>
    <fieldset>
      <legend>Lines</legend>
    </fieldset>

    <fieldset>
      <legend>Polylines</legend>
    </fieldset>
  </main>
</div>

<style>
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    font-weight: 400;

    color-scheme: light dark;
    color: rgba(255, 255, 255, 0.87);
    background-color: #242424;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .container {
    width: 100%;
    height: 100vh;
    max-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    hr {
      border: 1px solid rgba(127, 255, 212, 0.1);
    }
  }

  main {
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 16px;
    box-sizing: border-box;

    fieldset {
      margin-bottom: 1rem;
    }

    fieldset > legend {
      font-size: 13px;
    }
  }
</style>
