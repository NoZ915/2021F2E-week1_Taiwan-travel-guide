const keyword = document.querySelector('.keyword')
const limit = document.querySelector('.limit')
const send = document.querySelector('.send')
const newList = document.querySelector('.new-list')
const newList2 = document.querySelector('.new-list-2')
const city = document.querySelector('.city')
const category = document.querySelector('.category')

const listSection = document.querySelector('.list_section')
const listH2 = document.querySelector(".list_h2")
const listH22 = document.querySelector(".list_h2-2")
const list = document.querySelector(".list")
const list2 = document.querySelector(".list2")
const hotCitySpanValue = document.querySelector(".hot-city_span-value")

const wrongPageSearchSection = document.querySelector(".wrong-search-page_section")

const hotActivityContainer = document.querySelector(".hot-activity_container")
const hotActivityRow1 = document.querySelector(".hot-activity_row1")
const hotActivityRow2 = document.querySelector(".hot-activity_row2")
const lightboxContainer = document.querySelector(".lightbox_container")
const lightboxContainer2 = document.querySelector(".lightbox_container-2")

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

  //使用者搜尋餐廳
  if (categorySelect == "Restaurant") {
    axios.get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/Restaurant/${cityName}?$filter=contains(RestaurantName,'${keywordText}')&$top=50&$format=JSON`,
      {
        headers: getAuthorizationHeader()
      }
    )
      .then(function (response) {
        const thisData = response.data
        console.log(thisData)
        let str = ""
        let lightboxStr = ""

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
            <a class="list_card" href="#${item.RestaurantID}">
              <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
              <span class="list_sapn">${item.RestaurantName}</span>
              <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${item.Address ?? "沒有提供詳細地址"}</span></div>
            </a>
            `

            lightboxStr +=
              `
              <div class="lightbox" id="${item.RestaurantID}">
                <div class="lightbox_all">
                  <div class="lightbox_left">
                    <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="lightbox_img">
                    <span class="lightbox_span">${item.RestaurantName}</span>
                    <p class="lightbox_p">${item.Description}</p>
                    <div class="lightbox_detail">
                      <div>
                        <img src='./img/lightbox_address.png'>
                        <span>${item.Address ?? "沒有提供詳細地址"}</span>
                      </div>
                      <div>
                        <img src='./img/lightbox_phone.png'>
                        <span>${item.Phone ?? "沒有提供電話號碼"}</span>
                      </div>
                    </div>
                  </div>
                  <div class="lightbox_right"><a href="#none" class="lightbox_a"><i class="fas fa-times"></i></a></div>
                </div>
              </div>
              `
          }
        })
        newList.innerHTML = str
        listH2.innerHTML = `${cityNameText} ${categorySelectText}  <h3>（關鍵字： ${keywordText}）</h3>`
        lightboxContainer.innerHTML = lightboxStr
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  //使用者搜尋住宿
  if (categorySelect == "Hotel") {
    axios.get(
      `https://ptx.transportdata.tw/MOTC/v2/Tourism/Hotel/${cityName}?$filter=contains(HotelName,'${keywordText}')&$top=50&$format=JSON`,
      {
        headers: getAuthorizationHeader()
      }
    )
      .then(function (response) {
        const thisData = response.data
        console.log(thisData)
        let str = ""
        let lightboxStr = ""

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
              <a class="list_card" href="#${item.HotelID}">
                <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
                <span class="list_sapn">${item.HotelName}</span>
                <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${item.Address ?? "沒有提供詳細地址"}</span></div>
              </a>
              `

            lightboxStr +=
              `
            <div class="lightbox" id="${item.HotelID}">
              <div class="lightbox_all">
                <div class="lightbox_left">
                  <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="lightbox_img">
                  <span class="lightbox_span">${item.HotelName}</span>
                  <p class="lightbox_p">${item.Description}</p>
                  <div class="lightbox_detail">
                    <div>
                      <img src='./img/lightbox_address.png'>
                      <span>${item.Address ?? "沒有提供詳細地址"}</span>
                    </div>
                    <div>
                      <img src='./img/lightbox_phone.png'>
                      <span>${item.Phone ?? "沒有提供電話號碼"}</span>
                    </div>
                  </div>
                </div>
                <div class="lightbox_right"><a href="#none" class="lightbox_a"><i class="fas fa-times"></i></a></div>
              </div>
            </div>
            `
          }
        })
        newList.innerHTML = str
        listH2.innerHTML = `${cityNameText} ${categorySelectText}  <h3>（關鍵字： ${keywordText}）</h3>`
        lightboxContainer.innerHTML = lightboxStr
      })
      .catch(function (error) {
        console.log(error)
      })
  }

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
    let lightboxStr = ""
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
        <a class="list_card" href="#${hotRestaurantItemArray[i].RestaurantID}">
          <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
          <span class="list_sapn">${hotRestaurantItemArray[i].RestaurantName}</span>
          <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${hotRestaurantItemArray[i].Address ?? "沒有提供詳細地址"}</span></div>
        </a>
        `

      lightboxStr +=
        `
        <div class="lightbox" id="${hotRestaurantItemArray[i].RestaurantID}">
          <div class="lightbox_all">
            <div class="lightbox_left">
              <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="lightbox_img">
              <span class="lightbox_span">${hotRestaurantItemArray[i].RestaurantName}</span>
              <p class="lightbox_p">${hotRestaurantItemArray[i].Description}</p>
              <div class="lightbox_detail">
                <div>
                  <img src='./img/lightbox_address.png'>
                  <span>${hotRestaurantItemArray[i].Address ?? "沒有提供詳細地址"}</span>
                </div>
                <div>
                  <img src='./img/lightbox_phone.png'>
                  <span>${hotRestaurantItemArray[i].Phone ?? "沒有提供電話號碼"}</span>
                </div>
              </div>
            </div>
            <div class="lightbox_right"><a href="#none" class="lightbox_a"><i class="fas fa-times"></i></a></div>
          </div>
        </div>
        `
    }
    hotRestaurantList.innerHTML = str
    lightboxContainer.innerHTML = lightboxStr
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
    let lightboxStr = ""
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
        <a class="list_card" href="#${hotHotelItemArray[i].HotelID}">
          <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
          <span class="list_sapn">${hotHotelItemArray[i].HotelName}</span>
          <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${hotHotelItemArray[i].Address ?? "沒有提供詳細地址"}</span></div>
        </a>
        `

      lightboxStr +=
        `
        <div class="lightbox" id="${hotHotelItemArray[i].HotelID}">
          <div class="lightbox_all">
            <div class="lightbox_left">
              <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="lightbox_img">
              <span class="lightbox_span">${hotHotelItemArray[i].HotelName}</span>
              <p class="lightbox_p">${hotHotelItemArray[i].Description}</p>
              <div class="lightbox_detail">
                <div>
                  <img src='./img/lightbox_address.png'>
                  <span>${hotHotelItemArray[i].Address ?? "沒有提供詳細地址"}</span>
                </div>
                <div>
                  <img src='./img/lightbox_phone.png'>
                  <span>${hotHotelItemArray[i].Phone ?? "沒有提供電話號碼"}</span>
                </div>
              </div>
            </div>
            <div class="lightbox_right"><a href="#none" class="lightbox_a"><i class="fas fa-times"></i></a></div>
          </div>
        </div>
        `
    }
    hotHotelList.innerHTML = str
    lightboxContainer2.innerHTML = lightboxStr
  })
  .catch(function (error) {
    console.log(error)
  })

//--------------------------------
//     getAuthorizationHeader
//--------------------------------
function getAuthorizationHeader() {
  //  填入自己 ID、KEY 開始
  let AppID = '4f2c7e3696e84ec2bcf3d7a3ba93abe7';
  let AppKey = 'ygFUYETAQklHaLKz5pNSF4FPwrA';
  //  填入自己 ID、KEY 結束
  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  let HMAC = ShaObj.getHMAC('B64');
  let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';
  return { 'Authorization': Authorization, 'X-Date': GMTString };
}

//拿到 App ID 和 App Key 後就可以開始拿資料了，只是取資料的時候必須使用平臺提供的 HMAC 認證授權機制。
//HMAC 授權機制在每次取得 API 時要在 header 塞兩個參數：Authorization 和 X-Date。