  let currsong=new Audio();
  function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const formattedMins = mins < 10 ? '0' + mins : mins;
  const formattedSecs = secs < 10 ? '0' + secs : secs;
  return `${formattedMins}:${formattedSecs}`;
}
async function getsong() {
  let a = await fetch("http://127.0.0.1:5500/songs/public");
  let response = await a.text();
  console.log(response);

  let div = document.createElement("div");
  div.innerHTML = response;

  let as = div.getElementsByTagName("a");
  let songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (
      element.getAttribute("href") &&
      element.getAttribute("href").endsWith(".mp3")
    ) {
      const fullUrl = new URL(
        element.getAttribute("href"),
        "http://127.0.0.1:5500/songs/"
      );
      songs.push(fullUrl.href.split("/songs/")[1]);
    }
  }

  console.log(songs);
  return songs;
}
const playMusic=(track)=>{
    
    currsong.src="/songs/"+track
    currsong.play()
    play.src="pause.svg"
    document.querySelector(".songinfo").innerHTML=track
     document.querySelector(".songtime").innerHTML="00:00/00:00"
    
}

async function main() {

  let songs = await getsong();

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" src="music.svg" alt="">
                             <div class="info"> 
                                 <div> ${song.replaceAll("%20", " ")}</div> 
                                 <div>song artist</div>
                                
                                
                             </div> 
                             <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="play.svg" alt="">
                            </div> 

    
        
       </li>`;
    Array.from(
      document.querySelector(".songList").getElementsByTagName("li")
    ).forEach((e) => {
      e.addEventListener("click", (element) => {
        console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
      });
    });
  }
  play.addEventListener("click",()=>{
    if( currsong.paused){
        currsong.play()
         play.src="pause.svg"
    }
    else{
        currsong.pause()
      
         play.src="play.svg"
    }
  })
  currsong.addEventListener("timeupdate",()=>{
    console.log(currsong.currentTime,currsong.duration);
    document.querySelector(".songtime").innerHTML=`${ formatTime(currsong.currentTime)}/${formatTime(currsong.duration)}`;
    document.querySelector(".circle").style.left=(currsong.currentTime/currsong.duration)*100 +"%";
    
  })
  document.querySelector(".seekbar").addEventListener("click",e=>{
    console.log(e.target.getBoundingClientRect().width,e.offsetX);
    document.querySelector(".circle").style.left=(e.offsetX/e.target.getBoundingClientRect().width)*100 +"%";
    currsong.currentTime=(currsong.duration)*(e.offsetX/e.target.getBoundingClientRect().width);
  })
}

main();
