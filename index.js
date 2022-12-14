(function () {
    var $momentum;
  
    function createWorker() {
      var containerFunction = function () {
        var idMap = {};
  
        self.onmessage = function (e) {
          if (e.data.type === "setInterval") {
            idMap[e.data.id] = setInterval(function () {
              self.postMessage({
                type: "fire",
                id: e.data.id
              });
            }, e.data.delay);
          } else if (e.data.type === "clearInterval") {
            clearInterval(idMap[e.data.id]);
            delete idMap[e.data.id];
          } else if (e.data.type === "setTimeout") {
            idMap[e.data.id] = setTimeout(function () {
              self.postMessage({
                type: "fire",
                id: e.data.id
              });
              // remove reference to this timeout after is finished
              delete idMap[e.data.id];
            }, e.data.delay);
          } else if (e.data.type === "clearCallback") {
            clearTimeout(idMap[e.data.id]);
            delete idMap[e.data.id];
          }
        };
      };
  
      return new Worker(
        URL.createObjectURL(
          new Blob(["(", containerFunction.toString(), ")();"], {
            type: "application/javascript"
          })
        )
      );
    }
  
    $momentum = {
      worker: createWorker(),
      idToCallback: {},
      currentId: 0
    };
  
    function generateId() {
      return $momentum.currentId++;
    }
  
    function patchedSetInterval(callback, delay) {
      var intervalId = generateId();
  
      $momentum.idToCallback[intervalId] = callback;
      $momentum.worker.postMessage({
        type: "setInterval",
        delay: delay,
        id: intervalId
      });
      return intervalId;
    }
  
    function patchedClearInterval(intervalId) {
      $momentum.worker.postMessage({
        type: "clearInterval",
        id: intervalId
      });
  
      delete $momentum.idToCallback[intervalId];
    }
  
    function patchedSetTimeout(callback, delay) {
      var intervalId = generateId();
  
      $momentum.idToCallback[intervalId] = function () {
        callback();
        delete $momentum.idToCallback[intervalId];
      };
  
      $momentum.worker.postMessage({
        type: "setTimeout",
        delay: delay,
        id: intervalId
      });
      return intervalId;
    }
  
    function patchedClearTimeout(intervalId) {
      $momentum.worker.postMessage({
        type: "clearInterval",
        id: intervalId
      });
  
      delete $momentum.idToCallback[intervalId];
    }
  
    $momentum.worker.onmessage = function (e) {
      if (e.data.type === "fire") {
        $momentum.idToCallback[e.data.id]();
      }
    };
  
    window.$momentum = $momentum;
  
    window.setInterval = patchedSetInterval;
    window.clearInterval = patchedClearInterval;
    window.setTimeout = patchedSetTimeout;
    window.clearTimeout = patchedClearTimeout;
  })();
  var dakikasayi = "00";
  
  var saniyesayi = "00";
  
  var salisesayi = "00";
  
  var saatsayi = "00";
  
  var tursayac = 0;
  
  var sls;
  
  var basla = 2;
  
  function startKronometre() {
    basla++;
  
    if (basla % 2 == 1) {
      //bir kere daha tıklandığında başlat olsun BU İF KOŞULU KRONOMETRETNİN ÇALIŞMASINI SAĞLAR
  
      document.getElementById("startKronometre").innerHTML = "Durdur";
      document.getElementById("turKronometre").innerHTML = "Sırala";
  
      var sirala = document.getElementById("turKronometre");
  
      sirala.style.background = "#01aa63";
  
      sirala.style.opacity = "1";
  
      var baslat = document.getElementById("startKronometre");
  
      baslat.style.background = "#e00032";
  
      sls = setInterval(salise, 10);
    }
  
    if (basla % 2 == 0) {
      //eğer bir kere tıklandığında durdur olsun ARTIK BU İF KOŞULUNUN KRONOMETREYİ DURDURMASI LAZIM
  
      document.getElementById("startKronometre").innerHTML = "Başlat";
      document.getElementById("turKronometre").innerHTML = "Sıfırla";
  
      var sifirla = document.getElementById("turKronometre");
  
      sifirla.style.background = "#bc6e00";
  
      var dur = document.getElementById("startKronometre");
  
      dur.style.background = "#0099cc";
  
      clearInterval(sls);
    }
  } //end kronometre main function
  
  function salise() {
    //SALİSE FONKSYİONU SALİSE SAYIMINI YAPARAK KRONOMERTENİN ASIL İŞLEMLERİ AŞAĞIDA YAZPILIR
  
    salisesayi++;
  
    if (salisesayi < 10) {
      salisesayi = "0" + salisesayi;
      document.getElementById("salise").innerHTML = salisesayi;
    } //eğer salise 10 dan küçükse 01 02 03.. gibi gözüksün diye
  
    if (salisesayi >= 10) {
      document.getElementById("salise").innerHTML = salisesayi;
    } //10 dan büyükse iki haneli oluyor zaten 0 koymaya gerek yok
  
    if (salisesayi == 99) {
      saniyesayi++;
      salisesayi = 0;
  
      if (saniyesayi < 10) {
        document.getElementById("saniye").innerHTML = "0" + saniyesayi;
      }
  
      if (saniyesayi >= 10) {
        document.getElementById("saniye").innerHTML = saniyesayi;
      }
  
      if (saniyesayi == 60) {
        dakikasayi++;
        saniyesayi = 0;
        if (dakikasayi < 10) {
          document.getElementById("dakika").innerHTML = "0" + dakikasayi;
        }
        if (dakikasayi >= 10) {
          document.getElementById("dakika").innerHTML = dakikasayi;
        }
        if (dakikasayi == 60) {
          saatsayi++;
          dakikasayi = 0;
  
          if (saatsayi < 10) {
            document.getElementById("saat").innerHTML = "0" + saatsayi;
          }
          if (saatsayi >= 10) {
            document.getElementById("dakika").innerHTML = dakikasayi;
          }
          if (saatsayi == 24) {
            alert("! gün oldu");
          }
        }
      }
    } //end kronometre gösterilen bölümü
  } //end salise function
  
  function turKronometre() {
    if (basla % 2 == 1) {
      //bu koşullar ne zaman sıralama ne zaman sıfırlama yapmasını belirlemek için, bir butona iki özellik katmış oluruz
      tursayac++;
  
      var alan = document.getElementById("tur");
  
      var tur =
        tursayac +
        ". " +
        saatsayi +
        ":" +
        dakikasayi +
        ":" +
        saniyesayi +
        ":" +
        salisesayi;
  
      var tur = document.createTextNode(tur);
  
      var p = document.createElement("p");
  
      p.appendChild(tur);
  
      alan.appendChild(p);
    }
  
    if (basla % 2 == 0 && basla != 2) {
      window.location.reload(1); //eğer sayfa yenilenirse bilgiler sıfırlanmış olur.
    }
  } //end tur kronometre
  