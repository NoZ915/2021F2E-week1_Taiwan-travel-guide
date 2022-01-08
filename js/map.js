//--------------------------------
//
//            地圖處理
//
//--------------------------------
//當載入這支Leaflet框架時，"L"代表的就是這框架應用的所有服務

//.map是其中的一個function，有兩個參數，一個是map，另一個是物件
//設定一個地圖，把地圖定位在#map這個div裡面，先定位center座標、zoom定位16
//zoom是地圖縮放的等級
var map = L.map('map', {
  center: [22.604799, 120.2976256],
  zoom: 16
});

//載入地圖資料，這裡利用到的圖資是OpenStreetMap
//後方的.addTo是指「我要把這個地圖資料載入到哪裡」
//此處載入到"map"，也就是上方的map變數
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//使用navigator web API取得使用者當下的位置（經緯度）
//利用navigator.geolocation當中的getCurrentPosition函式
//getCurrentPosition函式須帶入主要兩個參數（參數為callback function）
//前者處理成功，後者處理錯誤狀態
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    //成功狀態
    function (position) {
      const longtitude = position.coords.longitude;//經度
      const latitude = position.coords.latitude;//緯度
      console.log(latitude, longtitude)

      //設定新的使用者定位座標
      map.setView([latitude, longtitude], 16);
      //將經緯度當作參數傳給底下的函式去執行
      getNearbyStationData(longtitude, latitude)
    },
    //錯誤訊息
    function (e) {
      console.log(error.message)
    }
  )
}

//--------------------------------
//
//          搜尋的資料處理
//
//--------------------------------
const send = document.querySelector(".send")
const city = document.querySelector(".city")
const dataItem = document.querySelectorAll("[data-item]")
const searchResultList = document.querySelector(".search-result-list")
let Data = [];
let filterData = [];
//--------------------------------
//        縣市大致座標整理
//--------------------------------
var cityPosition = [
  {
    name: "Taipei",
    latitude: 25.047778,
    longtitude: 121.531944
  },
  {
    name: "NewTaipei",
    latitude: 25.011111,
    longtitude: 121.445833
  },
  {
    name: "Taoyuan",
    latitude: 24.850000,
    longtitude: 121.216667
  },
  {
    name: "Taichung",
    latitude: 24.150000,
    longtitude: 120.666667
  },
  {
    name: "Tainan",
    latitude: 22.983333,
    longtitude: 120.183333
  },
  {
    name: "Kaohsiung",
    latitude: 22.616667,
    longtitude: 120.300000
  },
  {
    name: "Hsinchu",
    latitude: 24.804722,
    longtitude: 120.971389
  },
  {
    name: "MiaoliCounty",
    latitude: 24.563333,
    longtitude: 120.825833
  },
  {
    name: "Chiayi",
    latitude: 23.480000,
    longtitude: 120.449722
  },
  {
    name: "PingtungCounty",
    latitude: 22.675556,
    longtitude: 120.491389
  },
  {
    name: "KinmenCounty",
    latitude: 24.433333,
    longtitude: 118.333333
  },
]
//--------------------------------
//        點擊搜尋按鈕時執行
//--------------------------------
send.addEventListener("click", function () {
  const cityName = city.value;
  getStationData(cityName);
  //設定新的定位座標
  let index = "";
  for (let i = 0; i < cityPosition.length; i++) {
    if (cityPosition[i].name == cityName) {
      index = i;
    }
  }
  map.setView([cityPosition[index].latitude, cityPosition[index].longtitude], 15);

  //搜尋縣市租借站位資料
  function getStationData(cityName) {
    axios.get(
      `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/${cityName}?%24top=30&%24format=JSON`,
      {
        headers: getAuthorizationHeader()
      }
    )
      .then(function (response) {
        Data = response.data;
        getAvailableData(cityName)
      })
      .catch(function (error) {
        console.log(error);
      })
  }


  //搜尋縣市即時車位資料
  function getAvailableData(cityName) {
    axios.get(
      `https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/${cityName}?%24top=30&%24format=JSON`,
      {
        headers: getAuthorizationHeader()
      }
    )
      .then(function (response) {
        //-----marker部分-----//
        const availableData = response.data;
        console.log(availableData)
        //先將陣列清空
        while (filterData.length) {
          filterData.pop();
        }

        //去比對，並賦於新變數給availableData後，再將新的availableData推進filterData
        availableData.forEach((availableItem) => {
          Data.forEach((stationItem) => {
            if (availableItem.StationUID === stationItem.StationUID) {
              availableItem.StationName = stationItem.StationName.Zh_tw;
              availableItem.StationAddress = stationItem.StationAddress.Zh_tw;
              availableItem.StationPosition = stationItem.StationPosition;
              filterData.push(availableItem);
            }
          })
        })
        console.log(filterData);
        setMarker(filterData);

        //-----list部分-----//
        let str = "";
        filterData.forEach((item) => {
          if (item != undefined) {
            //顏色區分：租借歸還區塊
            let availableRentColor = ""
            if (item.AvailableRentBikes <= 5 && item.AvailableRentBikes > 0) {
              availableRentColor = "colorRed";
            } else if (item.AvailableRentBikes == 0) {
              availableRentColor = "colorGrey";
            } else {
              availableRentColor = "colorGreen";
            }
            //顏色區分：租借歸還區塊
            let availableReturnColor = ""
            if (item.AvailableReturnBikes <= 5 && item.AvailableRentBikes > 0) {
              availableReturnColor = "colorRed";
            } else if (item.AvailableReturnBikes == 0) {
              availableReturnColor = "colorGrey";
            } else {
              availableReturnColor = "colorGreen";
            }

            //更新時間資料處理
            let updateDateString = item.UpdateTime.substring(0, 10)
            let updateTimeString = item.UpdateTime.substring(11, 19)
            let updateTimeAndDate = updateDateString + " " + updateTimeString

            str +=
              `
            <div class="search-result">
              <span class="search-result_StationName">${item.StationName}</span>
              <span class="search-result_StationAddress">${item.StationAddress}</span>
              <span>
                <div class="${availableRentColor} search-result_Available">可租借 ${item.AvailableRentBikes}</div>
                <div class="${availableReturnColor} search-result_Available">可歸還 ${item.AvailableReturnBikes}</div>
                <button data-lat="${item.StationPosition.PositionLat}" data-lon="${item.StationPosition.PositionLon}">詳情</button>
              </span>
              <span class="search-result_updateTimeAndDate">Last update: ${updateTimeAndDate}</span>
            </div>
            `
          }
        })
        searchResultList.innerHTML = str

        //點擊左邊列表，地圖座標會重新定位到該位置上
        searchResultList.addEventListener('click', function (e) {
          map.setView([e.target.getAttribute("data-lat"), e.target.getAttribute("data-lon")], 24);
        })
      })
      .catch(function (error) {
        console.log(error);
      })
  }
})

//--------------------------------
//
//          附近的資料處理
//
//--------------------------------
//--------------------------------
//   串接附近的自行車租借站位資料
//--------------------------------
let nearbyData = [];
function getNearbyStationData(longtitude, latitude) {
  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Bike/Station/NearBy?%24top=30&%24spatialFilter=nearby(${latitude},${longtitude},1000)&%24format=JSON`,
    {
      headers: getAuthorizationHeader()
    }
  )
    .then(function (response) {
      nearbyData = response.data;
      getNearbyAvailibleData(longtitude, latitude);
    })
    .catch(function (error) {
      console.log(error);
    })
}

//--------------------------------
//       串接附近的即時車位資料
//--------------------------------
let nearbyFilterData = [];
function getNearbyAvailibleData(longtitude, latitude) {
  axios.get(
    `https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/NearBy?%24top=30&%24spatialFilter=nearby(${latitude},${longtitude},1000)&%24format=JSON`,
    {
      headers: getAuthorizationHeader()
    }
  )
    .then(function (response) {
      const nearbyAvailableData = response.data;

      //去比對，並賦於新變數給nearbyAvailableData後，再將新的nearbyAvailableData推進filterData
      nearbyAvailableData.forEach((nearbyAvailableDataItem) => {
        nearbyData.forEach((nearbyStationItem) => {
          if (nearbyAvailableDataItem.StationUID === nearbyStationItem.StationUID) {
            nearbyAvailableDataItem.StationName = nearbyStationItem.StationName.Zh_tw;
            nearbyAvailableDataItem.StationAddress = nearbyStationItem.StationAddress.Zh_tw;
            nearbyAvailableDataItem.StationPosition = nearbyStationItem.StationPosition;
            nearbyFilterData.push(nearbyAvailableDataItem);
          }
        })
      })
      setMarker(nearbyFilterData);
    })
    .catch(function (error) {
      console.log(error);
    })
}

//--------------------------------
//    在網頁上渲染出marker的標記
//--------------------------------
var markers
function setMarker(filterDataItem) {
  filterDataItem.forEach((item) => {
    //顏色區分：租借歸還區塊
    let availableRentColor = ""
    if (item.AvailableRentBikes <= 5 && item.AvailableRentBikes > 0) {
      availableRentColor = "colorRed";
    } else if (item.AvailableRentBikes == 0) {
      availableRentColor = "colorGrey";
    } else {
      availableRentColor = "colorGreen";
    }
    //顏色區分：租借歸還區塊
    let availableReturnColor = ""
    if (item.AvailableReturnBikes <= 5 && item.AvailableRentBikes > 0) {
      availableReturnColor = "colorRed";
    } else if (item.AvailableReturnBikes == 0) {
      availableReturnColor = "colorGrey";
    } else {
      availableReturnColor = "colorGreen";
    }

    //更新時間資料處理
    let updateDateString = item.UpdateTime.substring(0, 10)
    let updateTimeString = item.UpdateTime.substring(11, 19)
    let updateTimeAndDate = updateDateString + " " + updateTimeString

    //icon
    var greenIcon = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    var redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    var greyIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    //顏色區分：marker的icon顏色
    let iconColor = ""
    if (item.AvailableRentBikes <= 5 && item.AvailableRentBikes > 0) {
      iconColor = redIcon;
    } else if (item.AvailableRentBikes == 0) {
      iconColor = greyIcon;
    } else {
      iconColor = greenIcon;
    }

    //渲染標記上去地圖
    var markers = new L.MarkerClusterGroup().addTo(map);
    markers.addLayer(L.marker([item.StationPosition.PositionLat, item.StationPosition.PositionLon], { icon: iconColor }))
    markers.bindPopup(
      `
      <div class="card">
        <span class="card_StationName">${item.StationName}</span>
        <span class="card_StationAddress">${item.StationAddress}</span>
        <span>
          <div class="${availableRentColor} card_Available">可租借 ${item.AvailableRentBikes}</div>
          <div class="${availableReturnColor} card_Available">可歸還 ${item.AvailableReturnBikes}</div>
          <div></div>
        </span>
        <span class="card_updateTimeAndDate">Last update: ${updateTimeAndDate}</span>
      </div>
      `
    )
    map.addLayer(markers);

    send.addEventListener('click', function (e) {
      if (markers !== null) {
        map.removeLayer(markers);
      }
    })

  })
}

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