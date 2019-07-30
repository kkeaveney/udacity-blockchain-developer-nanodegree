import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';


let flights = [];
let contract;

(async() => {

    let result = null;
    //console.log("test");


    let contract = new Contract('localhost', () => {

        // add onfo about the owner of the contract
        (async() => {
            let owner = contract.owner;
            try {
                let airlineInfo = await contract.getAirline(owner);
                let address = airlineInfo[0];
                let hasPaid = airlineInfo[1];
                let isRegistered = airlineInfo[2];

                let contractOwnerElement = document.getElementById("contractOwner");

                let ownerInfoList = document.createElement("ul");
                for (let c = 0; c <= 2; c++) {
                    let listElement = document.createElement("li");
                    switch (c) {
                        case 0:
                            listElement.innerHTML = `Address: ${address}`;
                            break;
                        case 1:
                            listElement.innerHTML = `has paid: ${hasPaid}`;
                            break;
                        case 2:
                            listElement.innerHTML = `Is registered: ${isRegistered}`;
                            break;

                        }
                    ownerInfoList.appendChild(listElement);
                }
                contractOwnerElement.appendChild(ownerInfoList);
                let showBalanceBtn = document.createElement("button");
                showBalanceBtn.innerHTML = "Display contract balance";
                showBalanceBtn.setAttribute("class", "btn btn-primary");
                showBalanceBtn.addEventListener("click", async function() {
                    let currentBalance = await contract.contractBalance();
                    alert(`Contract balance is: ${currentBalance / 10**18} ether`);
                });
                contractOwnerElement.appendChild(showBalanceBtn);

            } catch(e) {
                console.log(e);
            }
        })();

        (async() => {
        let setOperatingStatusBtn = document.getElementById("setOpertingStatus");
        setOperatingStatusBtn.addEventListener("click", async function() {
          let mode = document.getElementById("setOperatingStat").value;
          mode = (mode == "true");
          try {
            alert(`Operating mode changed to ${mode}`);
            await contract.setStatus(contract.owner, mode);
            let opStatusPlaceholder = document.getElementById("opStatusPlaceholder");
            let status = await contract.getOperatingStatus();
            opStatusPlaceholder.innerHTML = status;

          } catch(error) {
            alert("Error");
          }
        })
    })();

        (async() => {
          var owner = contract.owner;
          let initialAirlines = ["BritishAirlines","WelshAirlines","ScottishAirlines"];
          let numberOfAirlines = await contract.getNumberOfAirlines();
          //console.log("Number of Airlines", Number(initialAirlines));

          if(numberOfAirlines < 4) {
            for(let i = 0; i < initialAirlines.length; i++){
              try  {
              await contract.registerAirline(owner, contract.airlines[i+1],initialAirlines[i]);
              console.log(`Airline ${initialAirlines[i]} is now registered`);
            } catch(error) {
              console.log("error");
              console.log(error);
            }
          }
          numberOfAirlines = await contract.getNumberOfAirlines();
          console.log("Number of Airlines", Number(numberOfAirlines));
        }

        })();

      (async() => {
        let airlineAddress = document.getElementById("selectAddress");
        let airlines = contract.airlines;
        for (let i = 0; i < airlines.length; i++) {
          let option = document.createElement("option");
          option.setAttribute("value", airlines[i]);
          option.innerHTML = `${i}: ${airlines[i]}`;
          airlineAddress.appendChild(option);
        }
        airlineAddress.addEventListener("change", () => {
          let addressline = document.getElementById("currentAddress");
          addressline.innerHTML = airlineAddress.value;
        })

      })();

      (async() => {
        let users = contract.allAccounts;
        let registeredAirlineElement = document.getElementById("airlineAddress");
        for (let  i = 0; i < users.length; i++) {
              let option = document.createElement("option");
              option.setAttribute('value', users[i]);
              option.innerHTML = `${i}: ${users[i]}`;
              registeredAirlineElement.appendChild(option);
        }
      })();

      });
})();
