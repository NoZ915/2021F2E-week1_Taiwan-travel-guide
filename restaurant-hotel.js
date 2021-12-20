const hotRestaurantSection = document.querySelector('.hot-restaurant_section')
const hotHotelSection = document.querySelector('.hot-hotel_section')

//--------------------------------
//       banner container
//--------------------------------
send.addEventListener("click", function (e) {
  const keywordText = keyword.value
  const cityName = city.value
  const categorySelect = category.value

  //取得選項的文字
  const cityNameTextWithSpace = city.options[city.selectedIndex].text
  const categorySelectTextWithSpace = category.options[category.selectedIndex].text
  //移除取得的文字中出現的空格
  const cityNameText = cityNameTextWithSpace.split(" ").join("")
  const categorySelectText = categorySelectTextWithSpace.split(" ").join("")

  //把所有原先的內容給移除掉
  hotRestaurantSection.setAttribute("class", "display_none")
  hotHotelSection.setAttribute("class", "display_none")
  listSection.setAttribute("class", "display_flex")


  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Tourism/${categorySelect}/${cityName}?$filter=contains(Name,'${keywordText}')&$top=50&$format=JSON`,
    {
      headers: getAuthorizationHeader()
    }
  )
    .then(function (response) {
      const thisData = response.data
      console.log(thisData)
      let str = ""

      if (response.data.length == 0) {
        wrongPageSearchSection.classList.remove("wrong-search-page_section")
        wrongPageSearchSection.setAttribute("class", "section")
        list.classList.add("display_none")
        console.log("hi");
      } else {
        wrongPageSearchSection.classList.remove("section")
        wrongPageSearchSection.setAttribute("class", "wrong-search-page_section")
        list.classList.remove("display_none")
      }

      thisData.forEach(item => {
        if (item != undefined) {
          const img = document.createElement("img")
          img.src = item.Picture.PictureUrl1
          str +=
            `
            <div class="list_card">
              <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
              <span class="list_sapn">${item.Name}</span>
              <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${item.Address ?? "沒有提供詳細地址"}</span></div>
            </div>
            `
        }
      })
      newList.innerHTML = str
      listH2.innerHTML = `${cityNameText} ${categorySelectText}  <h3>（關鍵字： ${keywordText}）</h3>`
    })
    .catch(function (error) {
      console.log(error)
    })
})

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

//--------------------------------
//     hot-hotel_conatiner
//--------------------------------
const hotHotelList = document.querySelector(".hot-hotel_list")
axios.get(
  `https://ptx.transportdata.tw/MOTC/v2/Tourism/Hotel?$top=30&$format=JSON`,
  {
    headers: getAuthorizationHeader()
  }
)
  .then(function (response) {
    const thisData = response.data
    let str = ""
    let hotHotelItemArray = []

    thisData.forEach(item => {
      if (item.Picture.PictureUrl1) {
        hotHotelItemArray.push(item)
      }
    })
    for (let i = 0; i < 10; i++) {
      const img = document.createElement("img")
      img.src = hotHotelItemArray[i].Picture.PictureUrl1

      str +=
        `
        <div class="list_card">
          <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
          <span class="list_sapn">${hotHotelItemArray[i].Name}</span>
          <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${hotHotelItemArray[i].Address ?? "沒有提供詳細地址"}</span></div>
        </div>
        `
    }
    hotHotelList.innerHTML = str
  })
  .catch(function (error) {
    console.log(error)
  })