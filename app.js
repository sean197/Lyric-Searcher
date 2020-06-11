const form = document.getElementById("form");
const search = document.getElementById("search");
const result = document.getElementById("result");
const small = document.querySelector("#form > small")

const apiKey = "https://api.lyrics.ovh";

// error text input
const error = function(){
    let html = "<small>Please insert an artist or a song</small>"
    small.innerHTML = html;
}

// eventlistener for user input
form.addEventListener("submit", function(e){
    e.preventDefault();

   searchValue = search.value.trim();
//    console.log(searchValue);

   if(!searchValue){
       error();
   } else{
       searchSong(searchValue);
   }
})

// search the song through API
const searchSong = async function(searchValue){

    // fetch returns a promise hence we can use await
    // fetch returns two .then which are the results in json format and the results
    const searchResult = await fetch(`${apiKey}/suggest/${searchValue}`);
    // .then(searchResult => searchResult.json())
    // .then(data => console.log(data)); 
    // storing the results in a json format which returns a promise hence we can use await
    const data = await searchResult.json();

    console.log(data);

    // function to update UI
    updateUI(data);
   
}; 

// update UI
const updateUI = function (data){
    let output = "";

    data.data.forEach(function(song){
        // span tag is inline
        output += `
        <li>
        <div>

        <img id="myImage" src="${song.album.cover}">
        <strong>
        Artist: ${song.artist.name}
        </strong> - Song: ${song.title}
        </div>

        <span class="button" data-album-cover="${song.album.cover}"  data-album-"${song.album.title}" data-artist="${song.artist.name}" data-songtitle="${song.title}">
            Get lyrics
        </span>
        </li>
        `;
    });

    result.innerHTML = `
        <ul class="song-list">
            ${output}
        </ul>
    `;
    scrollTo(0,550);
}

// Get lyrics
result.addEventListener("click", function(e){
    const clicked = e.target;

    if(clicked.className = "button"){
        const artist = clicked.getAttribute("data-artist");
        const songTitle = clicked.getAttribute("data-songtitle");

        getLyrics(artist, songTitle);
    };

    // getLyrics(artist, songTitle);

})


//get Lyrics for song
// async as we are going to get an api
const getLyrics = async function(artist, songTitle){

    // https://api.lyrics.ovh/v1/artist/title
    const res = await fetch(`${apiKey}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    // console.log(data);

    // r: return & n: new line
    // return and new line or
    // new line or return 
    // gives a line break
    //g: global flag and checks whole thing
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");

    result.innerHTML = `<h2><strong>${artist}</strong> - 
    ${songTitle}</h2>
    <span>${lyrics}</span>
    `;
}