<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import * as THREE from 'three'
  import ThreeGlobe from 'three-globe'
  import TrackballControls from 'three-trackballcontrols'

  import { themeStore } from '$lib/stores'

  let mapHeight
  let mapWidth

  const renderGlobe = () => {
    // Gen random data
    const N = 20

    const arcsData = [...Array(N).keys()].map(() => ({
      startLat: (Math.random() - 0.5) * 180,
      startLng: (Math.random() - 0.5) * 360,
      endLat: (Math.random() - 0.5) * 180,
      endLng: (Math.random() - 0.5) * 360,
      color: ['red', 'purple', 'pink', 'green'][Math.round(Math.random() * 3)]
    }))

    const Globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
      .arcsData(arcsData)
      .arcColor('color')
      .arcDashLength(0.4)
      .arcDashGap(4)
      .arcDashInitialGap(() => Math.random() * 5)
      .arcDashAnimateTime(1000)

    // Setup renderer
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(mapWidth, mapHeight - 200)
    document.querySelector('.node-map').appendChild(renderer.domElement)

    // Setup scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(
      $themeStore.selectedTheme === 'light' ? 0xfafafa : 0x171717
    )
    scene.add(Globe)
    scene.add(new THREE.AmbientLight(0xcccccc, Math.PI))
    scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI))

    // Setup camera
    const camera = new THREE.PerspectiveCamera()
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    camera.position.z = 300

    // Add camera controls
    const tbControls = new TrackballControls(camera, renderer.domElement)
    tbControls.minDistance = 101
    tbControls.rotateSpeed = 5
    tbControls.zoomSpeed = 0.8

    // Kick-off renderer
    ;(function animate() {
      // IIFE
      // Frame cycle
      tbControls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    })()
  }

  onMount(() => {
    renderGlobe()
    // window.addEventListener('resize', renderGlobe)
  })

  // onDestroy(() => {
  //   window.removeEventListener('resize', renderGlobe)
  // })
</script>

<div
  class="node-map w-full min-h-[calc(100vh-80px)]"
  bind:clientHeight={mapHeight}
  bind:clientWidth={mapWidth}
/>
