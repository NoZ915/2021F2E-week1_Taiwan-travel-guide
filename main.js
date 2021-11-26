const keyword = document.querySelector('.keyword')
const limit = document.querySelector('.limit')
const send = document.querySelector('.send')
const list = document.querySelector('.list')
const city = document.querySelector('.city')
const category = document.querySelector('.category')

//--------------------------------
//       banner container
//--------------------------------
send.addEventListener("click", function (e) {
  const keywordText = keyword.value
  const cityName = city.value
  const categorySelect = category.value

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
      list.innerHTML = str
    })
    .catch(function (error) {
      console.log(error)
    })
})



//--------------------------------
//       hot-city_conatiner      
//--------------------------------
// slides.addEventListener("click", function (e) {

//   axios.get(
//     `https://ptx.transportdata.tw/MOTC/v2/Tourism/${categorySelect}/${cityName}?&$top=50&$format=JSON`,
//     {
//       headers: getAuthorizationHeader()
//     }
//   )
//     .then(function (response) {
//       const thisData = response.data
//       console.log(thisData)
//       let str = ""

//       thisData.forEach(item => {
//         if (item.Picture.PictureUrl1) {
//           const img = document.createElement("img")
//           img.src = item.Picture.PictureUrl1
//           str +=
//             `
//             <div class="list_card">
//               <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
//               <span class="list_sapn">${item.Name}</span>
//               <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${item.Address ?? "沒有提供詳細地址"}</span></div>
//             </div>
//             `
//         }
//       })
//       list.innerHTML = str
//     })
//     .catch(function (error) {
//       console.log(error)
//     })
// })



//--------------------------------
//     hot-activity_conatiner      
//--------------------------------
//利用bubble sort去做時間排序
function bubbleSort(dateArr, itemArr) {
  for (let i = 0; i < dateArr.length; i++) {
    for (let j = 0; j < dateArr.length - 1 - i; j++) {
      if (dateArr[j] > dateArr[j + 1]) {
        [dateArr[j], dateArr[j + 1]] = [dateArr[j + 1], dateArr[j]];
        [itemArr[j], itemArr[j + 1]] = [itemArr[j + 1], itemArr[j]];
      }
    }
  }
  return dateArr, itemArr
}

//串接api
const hotActivityContainer = document.querySelector(".hot-activity_container")
const hotActivityRow1 = document.querySelector(".hot-activity_row1")
const hotActivityRow2 = document.querySelector(".hot-activity_row2")

axios.get(
  `https://ptx.transportdata.tw/MOTC/v2/Tourism/Activity/?&$top=50&$format=JSON`,
  {
    headers: getAuthorizationHeader()
  }
)
  .then(function (response) {
    const thisData = response.data
    console.log(thisData)
    let str1 = ""
    let str2 = ""
    let hotActivityItemArray = []
    let dateArray = []

    //處理時間先後排序
    thisData.forEach(item => {
      if (item.Picture.PictureUrl1) {
        //把item丟進陣列裡面
        hotActivityItemArray.push(item)

        //時間資料處理乾淨
        const dateString = item.StartTime
        const date = dateString.substring(0, 10)
        const dateOnlyArray = date.split("-")
        const dateOnlyString = dateOnlyArray.join("")

        dateArray.push(dateOnlyString)
      }
    })
    bubbleSort(dateArray, hotActivityItemArray)

    //用整理排序過的資料取兩筆（第一筆跟第二筆資料）
    for (let i = 0; i < 2; i++) {
      if (hotActivityItemArray[i].Picture.PictureUrl1) {
        //圖片處理
        const img = document.createElement("img")
        img.src = hotActivityItemArray[i].Picture.PictureUrl1
        str1 +=
          `
          <div class="hot-activity_block">
            <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="hot-activity_img">
            <div class="hot-activity_introduction">
              <span class="hot-activity_span">${hotActivityItemArray[i].Name}</span>
              <p class="hot-activity_p">${hotActivityItemArray[i].Description}</p>
              <div class="hot-activity_address_container"><img src="./img/icon_map.png" class="icon_map"><span class="hot-activity_address_span">${hotActivityItemArray[i].Address ?? "沒有提供詳細地址"}</span></div>
              <button>活動詳情</button>
            </div>
          </div>
          `
      }
    }
    //用整理排序過的資料取兩筆（第一筆跟第二筆資料）
    for (let i = 2; i < 4; i++) {
      if (hotActivityItemArray[i].Picture.PictureUrl1) {
        //圖片處理
        const img = document.createElement("img")
        img.src = hotActivityItemArray[i].Picture.PictureUrl1
        str2 +=
          `
          <div class="hot-activity_block">
            <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="hot-activity_img">
            <div class="hot-activity_introduction">
              <span class="hot-activity_span">${hotActivityItemArray[i].Name}</span>
              <p class="hot-activity_p">${hotActivityItemArray[i].Description}</p>
              <div class="hot-activity_address_container"><img src="./img/icon_map.png" class="icon_map"><span class="hot-activity_address_span">${hotActivityItemArray[i].Address ?? "沒有提供詳細地址"}</span></div>
              <button>活動詳情</button>
            </div>
          </div>
          `
      }
    }
    hotActivityRow1.innerHTML = str1
    hotActivityRow2.innerHTML = str2
  })
  .catch(function (error) {
    console.log(error)
  })



//--------------------------------
//     hot-ScenicSpot_conatiner
//--------------------------------
const hotScenicSpotList = document.querySelector(".hot-scenic-spot_list")
axios.get(
  `https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?$top=30&$format=JSON`,
  {
    headers: getAuthorizationHeader()
  }
)
  .then(function (response) {
    const thisData = response.data
    console.log(thisData)
    let str = ""
    let hotScenicSpotItemArray = []

    thisData.forEach(item => {
      if (item.Picture.PictureUrl1) {
        hotScenicSpotItemArray.push(item)
      }
    })
    for (let i = 0; i < 10; i++) {
      const img = document.createElement("img")
      img.src = hotScenicSpotItemArray[i].Picture.PictureUrl1

      str +=
        `
        <div class="list_card">
          <img src="${img.src}" onerror="this.src='./img/placeholder.png'" class="list_img">
          <span class="list_sapn">${hotScenicSpotItemArray[i].Name}</span>
          <div class="address_container"><img src="./img/icon_map.png" class="icon_map"><span class="address_span">${hotScenicSpotItemArray[i].Address ?? "沒有提供詳細地址"}</span></div>
        </div>
        `
    }
    hotScenicSpotList.innerHTML = str
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



//--------------------------------
//     a新增onclick事件，可滑動
//--------------------------------
const leftButtonAnchor = document.querySelector('.next-page_left-anchor')
const rightButtonAnchor = document.querySelector('.next-page_right-anchor')
const leftButton = document.querySelector('.next-page_left-button')
const rightButton = document.querySelector('.next-page_right-button')
const slides = document.querySelector('.slides')

leftButtonAnchor.addEventListener('click', function () {
  slides.style = "transform: translateX(-1062px)"
  leftButton.style = "visibility: hidden"
  rightButton.style = "visibility: visible"
})
rightButtonAnchor.addEventListener('click', function () {
  slides.style = "transform: translateX(0px)"
  rightButton.style = "visibility: hidden"
  leftButton.style = "visibility: visible"
})