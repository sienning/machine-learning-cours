<template>
  <div id="all">
    <h1 id="idh12">pokemon</h1>
    <input type="number" class="form-control" :max='898'  v-on:change="changepk">
    <!--<img id="idh1" src="../assets/img.png">
    <button v-on:click="clicked">click</button>
    <button v-on:click="hide">hide</button>
    <button v-on:click="show">show</button>

    <button v-on:click="create">create</button>
    <div id="create"></div>-->
    <p>{{this.namepk}}</p>
    <p>{{this.heightpk}}</p>
    <!--<p>{{this.imgurl}}</p>-->
    <div id="imgpk"></div>
    <!--<p>{{this.typespk}}</p>-->
    <ul id="type">
      <li v-for="value in this.typespk">
        {{ value.type.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'HelloWorld',
  data () {  
    return {
      info: null,
      namepk: null,
      heightpk: null,
      imgurl: null,
      typespk: null,
      form:{url:""},
      url:"",
      stack: false
      }
  },
  methods: {
    clicked: function () {
      console.log("click")
    },
    hide: function () {
      console.log("hide")
      document.getElementById("idh1").style.display = 'none';
    },
    show: function () {
      console.log("show")
      document.getElementById("idh1").style.display = 'block';
    },
    create: function () {
      var txt = "test"
      var h = document.createElement("p");
      var t = document.createTextNode(txt);
      h.appendChild(t);
      var currentDiv = document.getElementById('create');
      currentDiv.appendChild(h)
    },
    changepk(event){

      this.url ="https://pokeapi.co/api/v2/pokemon/" + event.target.value;
      console.log(this.url)
      axios
      .get(this.url)
      .then(response =>  {
        this.info = response.data
        this.namepk = this.info.name
        this.heightpk = this.info.height
        this.imgurl = this.info.sprites.front_default
        this.typespk = this.info.types
        var imgdom = null 
        if(this.stack){
          var imgdom =document.createElement('img')
          imgdom.src = this.imgurl
          document.getElementById('imgpk').appendChild(imgdom);
        }
        else{
          var imgdom =document.getElementById('imgscr')
          imgdom.src = this.imgurl
        }
    })
    } 
  
  },
  mounted () {
    axios
      .get('https://pokeapi.co/api/v2/pokemon/1')
      .then(response =>  {
        this.info = response.data
        this.namepk = this.info.name
        this.heightpk = this.info.height
        this.imgurl = this.info.sprites.front_default
        this.typespk = this.info.types
        var imgdom = document.createElement('img')
        imgdom.src = this.imgurl
        imgdom.id = "imgscr"
        document.getElementById('imgpk').appendChild(imgdom);
    })
  }
}
</script>

<style scoped>
  #all {
    width: 100% !important;
    height: 100% !important;
    background-color:rgb(250, 0, 0);
  }
</style>
