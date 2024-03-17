document
  .getElementById("sstfForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Function to calculate Total Head Movement
    function calculateTotalHeadMovement(currentTrack, requestQueue) {
      var totalHeadMovement = 0;
      var numOfRequests = requestQueue.length;
      var visited = new Array(numOfRequests).fill(0);

      for (var i = 0; i < numOfRequests; i++) {
        visited[i] = 0;
      }

      for (var i = 0; i < numOfRequests; i++) {
        var minDistance = Number.MAX_SAFE_INTEGER;
        var minIndex = -1;

        for (var j = 0; j < numOfRequests; j++) {
          if (!visited[j]) {
            var distance = Math.abs(currentTrack - requestQueue[j]);
            if (distance < minDistance) {
              minDistance = distance;
              minIndex = j;
            }
          }
        }

        visited[minIndex] = 1;
        totalHeadMovement += minDistance;
        currentTrack = requestQueue[minIndex];
      }

      return totalHeadMovement;
    }

    // Function to calculate Seek Time
    function calculateSeekTime(totalHeadMovement, seekRate) {
      return (totalHeadMovement * seekRate) / 100;
    }

    //Input from the user
    var tracks = parseInt(document.getElementById("tracks").value);
    var prev = parseInt(document.getElementById("prev").value);
    var currentTrack = parseInt(document.getElementById("current").value);
    var numOfRequests = parseInt(document.getElementById("requested").value);
    var seekRate = parseInt(document.getElementById("seek").value);

    // Input the requested tracks from the user
    var requestQueue = [];
    for (var i = 0; i < numOfRequests; i++) {
      var request = parseInt(prompt("Enter requested track " + (i + 1) + ":"));
      requestQueue.push(request);
    }

    //Output Computation
    var totalHeadMovement = calculateTotalHeadMovement(
      currentTrack,
      requestQueue
    );
    var seekTime = calculateSeekTime(totalHeadMovement, seekRate);
    var output = "Requested Tracks: " + requestQueue.join(", ") + "<br>";
    output += "Total Head Movement: " + totalHeadMovement + "<br>";
    output += "Seek Time: " + seekTime + "s" + "<br>";

    document.getElementById("output").innerHTML = output;
    var ctx = document.getElementById("myChart").getContext("2d");

    // SSTF Disk Scheduling Algorithm
    function sstfDiskScheduling(currentTrack, requestQueue) {
      var movements = [currentTrack];
      var visited = new Array(requestQueue.length).fill(false);

      for (var i = 0; i < requestQueue.length; i++) {
        var minDistance = Number.MAX_SAFE_INTEGER;
        var nextIndex = -1;

        for (var j = 0; j < requestQueue.length; j++) {
          if (!visited[j]) {
            var distance = Math.abs(currentTrack - requestQueue[j]);
            if (distance < minDistance) {
              minDistance = distance;
              nextIndex = j;
            }
          }
        }

        visited[nextIndex] = true;
        currentTrack = requestQueue[nextIndex];
        movements.push(currentTrack);
      }

      return movements;
    }

    // Calculate head movements using SSTF algorithm
    var headMovements = sstfDiskScheduling(currentTrack, requestQueue);

    var chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: headMovements.map((_, index) => index + 1),
        datasets: [
          {
            label: "Head Movements",
            data: headMovements,
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "linear",
            position: "bottom",
          },
          y: {
            type: "linear",
            position: "left",
          },
        },
      },
    });
  });
