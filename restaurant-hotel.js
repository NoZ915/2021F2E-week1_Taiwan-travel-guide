//--------------------------------
//     hot-Restaurant_conatiner
//--------------------------------
const hotRestaurantList = document.querySelector(".hot-restaurant_list")
axios.get(
  `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant?$top=30&$format=JSON`,
  {
    headers: getAuthorizationHeader()
  }
)
  .then(function (response) {
    const thisData = response.data
    console.log(thisData)
    let str = ""
    let hotRestaurantItemArray = []

    thisData.forEach(item => {
      if (item.Picture.PictureUrl1) {
        hotRestaurantItemArray.push(item)
      }
    })
    for (let i = 0; i < 10; i++) {
      const img = document.createElement("img")
      img.src = hotRestaurantItemArray[i].Picture.PictureUrl1

      str +=
        `
        <div class="list_card">
          <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
          <span class="list_sapn">${hotRestaurantItemArray[i].Name}</span>
          <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${hotRestaurantItemArray[i].Address ?? "沒有提供詳細地址"}</span></div>
        </div>
        `
    }
    hotRestaurantList.innerHTML = str
  })
  .catch(function (error) {
    console.log(error)
  })