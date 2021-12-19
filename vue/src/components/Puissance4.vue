<template>
  <div id="all">
    <h1>Puissance 4</h1>
    <div id="container"></div>
  </div>
</template>

<script>
import * as Three from "three";
export default {
  name: "Puissance-4",
  data() {
    return {
      scene: undefined,
      camera: undefined,
      renderer: undefined,
    };
  },
  methods: {
    init: function () {
      let container = document.getElementById("container");
      let tailleTabX = 7;
      let tailleTabY = 6;
      this.camera = new Three.PerspectiveCamera(
        70,
        container.clientWidth / container.clientHeight,
        0.01,
        20
      );
      this.camera.position.z = 7;
      this.camera.position.x = tailleTabX / 2;
      this.camera.position.y = tailleTabY / 2;

      this.scene = new Three.Scene();
      let tab = [];
      let tile = [];

      const geometry = new Three.PlaneGeometry(0.97, 0.97);
      const vide = new Three.MeshBasicMaterial({
        color: "#979797",
        side: Three.DoubleSide,
      });
      function HighlightCheckCase(scene, tiletab, colortile) {
        for (let i = 0; i < tiletab.length; i++) {
          const geometry = new Three.PlaneGeometry(0.7, 0.7);
          const mat = new Three.MeshBasicMaterial({
            color: colortile,
            side: Three.DoubleSide,
          });
          const plane = new Three.Mesh(geometry, mat);
          scene.add(plane);
          plane.position.x = tiletab[i][0];
          plane.position.y = tiletab[i][1];
        }
      }
      for (let i = 0; i < tailleTabX; i++) {
        tab[i] = [];
        tile[i] = [];
        for (let j = 0; j < tailleTabY; j++) {
          let mat = vide;
          tab[i][j] = 0;
          tile[i][j] = new Three.Mesh(geometry, mat);
          this.scene.add(tile[i][j]);
          tile[i][j].position.x = i;
          tile[i][j].position.y = j;
        }
      }
      console.log("tab : ", tab);

      //------------------------------------------------------------------------------------------------------------------
      this.renderer = new Three.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);
    },
    animate: function () {
      requestAnimationFrame(this.animate);
      //this.mesh.rotation.x += 0.01;
      //this.mesh.rotation.y += 0.02;
      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
};
</script>

<style scoped>
#container {
  width: 1000px;
  height: 700px;
  margin-left: auto;
  margin-right: auto;
}
</style>