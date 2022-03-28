<template>
  <div class="content">
    <h2>Demo of @miii/y-google-cast</h2>
    <a target="_blank" class="link" href="https://github.com/miii/y-google-cast">https://github.com/miii/y-google-cast</a>
    
    <State />
    <google-cast-launcher />
    
    <Router>
      <template #receiver><Receiver /></template>
      <template #sender><Sender /></template>
    </Router>
  </div>
  <Console />
</template>
<style>
html {
  background: #111;
  color: #FFF;
  font-size: 12px;
  font-family: monospace;
}

h2 {
  margin: 0 0 .5rem 0;
  font-family: Arial, Helvetica, sans-serif;
}

.link {
  margin: 0 0 .5rem 0;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  color: #FFF;
}

.content {
  position: sticky;
  top: 0;
  background: #111;
  padding: .5rem 0;
  z-index: 1;
  margin-top: -.5rem;
}

google-cast-launcher {
  width: 3rem;
  position: fixed;
  top: 1rem;
  right: 1rem;
}
</style>