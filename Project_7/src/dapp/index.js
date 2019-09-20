import DOM from './dom';
import Contract from './contract';
import './flightsurety.css';
import {flightCodes} from "./flightData.js";


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
        let registeredAirlineElement = document.getElementById("airlineReg-address");
        for (let  i = 0; i < users.length; i++) {
              let option = document.createElement("option");
              option.setAttribute('value', users[i]);
              option.innerHTML = `${i}: ${users[i]}`;
              registeredAirlineElement.appendChild(option);
        }
      })();

      (async() => {
        let users = contract.allAccounts;
        let airlineElement = document.getElementById("airlineFund-address");
         for(let i = 0; i < users.length; i++) {
           let option = document.createElement("option");
           option.setAttribute("value", users[i]);
           option.innerHTML = `${i}: ${users[i]}`;
           airlineElement.appendChild(option);
         }
      })();

      (async() => {
        let users = contract.allAccounts;
        let passengerAddresss =  document.getElementById("selectPassengerAddress");
          for(let i = 0; i < users.length; i++) {
              let option = document.createElement("option");
              option.setAttribute("value", users[i]);
              option.innerHTML = `${i}: ${users[i]}`;
              passengerAddresss.appendChild(option);
          }

          passengerAddresss.addEventListener("change", async function () {
            let passengerLineElement = document.getElementById("currentPassengerAddress");
            passengerLineElement.innerHTML = passengerAddresss.value;
          });

      })();

      (async() => {
              let flightDataKeys = Object.keys(flightCodes);
              let flightElement  = document.getElementById("flightOrigin");
              let destinationElement = document.getElementById("flightDestination");
              for (let i = 0; i < flightDataKeys.length; i++) {
                  let option = document.createElement("option");
                  option.setAttribute("value", flightDataKeys[i]);
                  option.innerHTML = flightDataKeys[i];
                  flightElement .appendChild(option);
                  option = document.createElement("option");
                  option.innerHTML = flightDataKeys[i];
                  destinationElement.appendChild(option);
              }

              flightElement.addEventListener("change", () => {
                  let codeElement = document.getElementById("originCode");
                  codeElement.innerHTML = flightCodes[flightElement .value];
              });

              destinationElement.addEventListener("change", () => {
                  let destinationCodeElement = document.getElementById("destinationCode");
                  destinationCodeElement.innerHTML = flightCodes[destinationElement.value];
              });

          })();

          (async() => {
            let flightDeptDateElement = document.getElementById("flightDepartureDay");
            flightDeptDateElement.addEventListener("change", () => {
                alert(flightDeptDateElement.value);
            })
        })();

        (async() => {
            let hourEl = document.getElementById("flightHour");
            let minuteEl = document.getElementById("flightMinute");
            for (let i = 0; i < 24; i++) {
                let option = document.createElement("option");
                if (i < 10) {
                    option.setAttribute("value", `0${i}`);
                    option.innerHTML = `0${i}`;
                } else {
                    option.setAttribute("value", i);
                    option.innerHTML = i;
                }
                hourEl.appendChild(option);
            }
            for (let i = 0; i < 60; i++) {
                let option = document.createElement("option");
                if (i < 10) {
                    option.setAttribute("value", `0${i}`);
                    option.innerHTML = `0${i}`;
                } else {
                    option.setAttribute("value", i);
                    option.innerHTML = i;
                }
                minuteEl.appendChild(option);
            }
        })();

        (async() => {
          let regFlightBtn = document.getElementById("reg-flight");
              regFlightBtn.addEventListener("click", async function() {
                  let address = document.getElementById("selectAddress").value;

                  let flightID= document.getElementById("flightCode").value;
                  let departure = document.getElementById("flightOrigin").value;
                  let destination = document.getElementById("flightDestination").value;

                  let flightDeptDay = document.getElementById("flightDepartureDay").value;
                  let flightDeptHour = document.getElementById("flightHour").value;
                  let flightDeptMinute = document.getElementById("flightMinute").value;

                  let departureDate = new Date(flightDeptDay + "T" + flightDeptHour + ":" + flightDeptMinute + ":00Z");
                  console.log(flightDeptDay + "T" + flightDeptHour + ":" + flightDeptMinute + ":00Z");
                  departureDate = departureDate.getTime();
                  console.log(departureDate);
                  console.log(address, " Airline address");
                  console.log(flightID, " flight code");
                  console.log(departure, " origin");
                  console.log(destination, " destination");
                  console.log(departureDate, " dept date");

            try {

                    await contract.registerFlight(address, flightID, departure, destination, departureDate);
                } catch(err) {
                    console.log(err);
                }


          })
        })();

        (async() => {
            let flightsBtn = document.getElementById("show-flights");

            flightsBtn.addEventListener("click", displayFlights);
        })();

        (async() => {
            let airlinesBtn = document.getElementById("show-airlines");
            airlinesBtn.addEventListener("click", displayAirlines);
        })();

        (async() => {
          let fundBtn = document.getElementById("fund-airline");
          fundBtn.addEventListener("click", async function() {
            let airlineAddress = document.getElementById("selectAddress").value;
            let fundedAirline = document.getElementById("airlineFund-address").value;
            try {
              alert(`The airline ${fundedAirline} is now funded`);
              await contract.fundAirline(fundedAirline);
            } catch(err) {
              console.log(err);
            }
          })
        })();

        (() => {
            let registeredAirlineBtn = document.getElementById("registerAirline");
            registeredAirlineBtn.addEventListener("click", async function() {
                let senderAirlineAddress = document.getElementById("selectAddress").value;
                let newAirlineAddress = document.getElementById("airlineReg-address").value;
                let newAirline = document.getElementById("airlineName").value;

                try {
                    await contract.registerAirline(senderAirlineAddress, newAirlineAddress, newAirline);
                    contract.airlines.push(newAirlineAddress);

                    } catch(error) {
                    console.log(error);
                }
            });
        })();

        async function displayFlights() {
              let passenger = document.getElementById("selectPassengerAddress").value;
              let numberOfFlights = await contract.getNumberOfFlights();
              alert(`There are ${numberOfFlights} of registered flights`);
              let flightElement = document.getElementById("showRegisteredFlights");
              flightElement.innerHTML = "";

              let table = document.createElement("table");
              let headers = `
              <tr><th>Airline</th>
              <th>Flight ID</th>
              <th>From</th>
              <th>to  </th>
              <th>departureDate</th>
              <th>InsureFlight (airlines)</th>
              <th>Status Code </th>
              <th>Buy Insurance </th>
              <th>Fetch Status</th>
              </tr>`;
              table.innerHTML = headers;

              for(let i = 0; i < numberOfFlights; i++) {

                let flightInfoTemp = await contract.getFlightByNum(i);
                let address = flightInfoTemp[0];
                let flightID = flightInfoTemp[3];
                let source = flightInfoTemp[4];
                let destination = flightInfoTemp[4];
                let departDate = flightInfoTemp[6];
                console.log(address, flightID, departDate, source, destination);
                let key = await contract.getFlightKey(address, flightID, departDate);
            //    console.log('key',key);
                let airlineDetails = await contract.getAirline(address);
            //    console.log('airlineDetails',airlineDetails);
                let flightInfo = await contract.getFlight(key);
                console.log('flightInfo',flightInfo);


                //console.log(flightInfo[i]);

                let row = document.createElement("tr");
                let tableData = document.createElement("td")
                tableData.innerHTML = flightInfo[0];
                let tableData2 = document.createElement("td");
                tableData2.innerHTML = flightInfo[3];
                let tableData3 = document.createElement("td");
                tableData3.innerHTML = flightInfo[4];
                let tableData4 = document.createElement("td");
                tableData4.innerHTML = flightInfo[5];

                let tableData5 = document.createElement("td");
                tableData5.innerHTML = new Date(Number(flightInfo[6])).toGMTString();

                row.appendChild(tableData);
                row.appendChild(tableData2);
                row.appendChild(tableData3);
                row.appendChild(tableData4);
                row.appendChild(tableData5);

                let tableData6 = document.createElement("td");
                let tableData8 = document.createElement("td");
                let tableData9 = document.createElement("td");

                  console.log(flightInfo[2])
                  if (flightInfo[2]) {
                  tableData6.innerHTML = "Insured";
                  let fetchStatusBtn = document.createElement("button");
                  fetchStatusBtn.innerHTML = "Get Flight Status";
                  fetchStatusBtn.addEventListener("click", async function (){
                    try {
                        let flightID = flightInfo[3];
                        let departureDate = flightInfo[6];
                        await contract.getFlightStatus(passenger,address, flightID, departDate);
                        alert(`Fetching status of flight ${flightID}`);
                      } catch(error) {
                        console.log(error);
                        alert('There has been an error');
                      }

                  });

                  tableData9.appendChild(fetchStatusBtn);

                  let buyInsuranceBtn = document.createElement("button");
                  buyInsuranceBtn.innerHTML = "Purchase insurance";
                  buyInsuranceBtn.addEventListener("click", async function () {
                    let passengerAddress = document.getElementById("selectAddress").value;
                    let insurancePremium = document.getElementById("premiumValue").value;
                    insurancePremium = await contract.web3.utils.toWei(insurancePremium,"ether");
                    let flightID = flightInfo[3];
                    let departureDate = flightInfo[6];
                    console.log(passengerAddress);
                    console.log(insurancePremium);
                    console.log(flightID);
                    console.log(departureDate);

                    try {
                        await contract.buyInsurance(
                          passengerAddress,
                          address,
                          departureDate,
                          flightID,
                          insurancePremium);
                          alert(`Insurance for flight ${flightID} is being processed`);
                    } catch(error) {
                      console.log(error);
                      alert("There has been an error");
                    }

                  });
                    tableData8.appendChild(buyInsuranceBtn);
                } else {
                  let insureFlightBtn = document.createElement("button");
                  insureFlightBtn.innerHTML = "Insure Flight";
                  insureFlightBtn.addEventListener("click", async function (){
                    let airline = document.getElementById("selectAddress").value;
                    console.log(airline);
                    let flightCodeID = flightInfo[0];
                    console.log(flightID);
                    let departureDate = Number(flightInfo[6]);
                    console.log("departureDate",departureDate, typeof departureDate);

                    try {
                      await contract.insureFlight(airline, flightID, departureDate);
                      alert(`Flight ${flightID} is being processed`);
                    } catch(error) {
                      console.log(error);
                      alert("There has been an error");
                    }

                  });
                  tableData6.appendChild(insureFlightBtn);

                }

                row.appendChild(tableData6);

                let tabledate7 = document.createElement("td");
                let statusCode = flightInfo[7];
                tabledate7.innerHTML = statusCode;
                row.appendChild(tabledate7);

                row.appendChild(tableData8);
                row.appendChild(tableData9);
                table.appendChild(row);

              }

              flightElement.appendChild(table);
          }

        async function showInsuredFlights() {
          let passengerAddress = document.getElementById("selectPassengerAddress").value;
          let numFlightsInsured = await contract.getInsuredKeysLength(passengerAddress);
          console.log("getInsuredKeysLength",numFlightsInsured);
          if (numFlightsInsured == 0) {
            alert(`There are no flights insured by passenger ${passengerAddress}`);
          }
          console.log("Flights insured", numFlightsInsured);

          let insuredFlightsBox = document.getElementById("insuredFlightsBox");
          insuredFlightsBox.innerHTML= "";
          let table = document.createElement("table");
          let tableHeaders = `
          <tr><th>Airline</th>
          <th>Flight Code</th>
          <th>From</th>
          <th>To</th>
          <th>departureDate</th>
          <th>Status Code</th>
          <th>Insurer balance (Ether)</th>
          <th>Withdraw funds </th>
          </tr>`;
          table.innerHTML = tableHeaders;

          for(let i = 0; i <numFlightsInsured; i++) {
                let flightKey = await contract.getInsuredFlights(passengerAddress, i);
                let flightInfo = await contract.getFlight(flightKey);



              let airlineInfo = await contract.getAirline(flightInfo[7]);
              let flightID = flightInfo[3];
              let departureDate = flightInfo[6];
              let from = flightInfo[4];
              let to = flightInfo[5];
              let statCode = flightInfo[7];

              let insurerBalance = await contract.getInsuranceBalance(passengerAddress, flightKey);
              let insurerBalanceMod = await contract.web3.utils.fromWei(insurerBalance, "ether");

              let tableRow = document.createElement("tr");
              let tableData2 = document.createElement("td");
              tableData2.innerHTML = flightID;
              let tableData3 = document.createElement("td");
              tableData3.innerHTML = from;
              let tableData4 = document.createElement("td");
              tableData4.innerHTML = to;
              let tableData5 = document.createElement("td");
              tableData5.innerHTML = new Date(Number(departureDate)).toGMTString();
              let tableData6 = document.createElement("td");
              tableData6.innerHTML = statCode;
              let tableData7 = document.createElement("td");
              tableData7.innerHTML = insurerBalanceMod;
              let tableData8 = document.createElement("td");
              let withdrawBtn = document.createElement("button");
              withdrawBtn.innerHTML = "Withdraw funds";
              withdrawBtn.addEventListener("click", async function() {
                if(insurerBalance != 0) {
                  try { await contract.payout(passengerAddress, flightKey, insurerBalance);
                  alert(`Withdrawing Funds for flight ${flightCode} insurance`);

                } catch(error){
                  console.log(error);
                }

              } else {
                alert("The user has no funds");
              }
            });

              tableData8.appendChild(withdrawBtn);
              tableRow.appendChild(tableData2);
              tableRow.appendChild(tableData3);
              tableRow.appendChild(tableData4);
              tableRow.appendChild(tableData5);
              tableRow.appendChild(tableData6);
              tableRow.appendChild(tableData7);
              tableRow.appendChild(tableData8);
              table.appendChild(tableRow);
              }
              insuredFlightsBox.appendChild(table);

        }

        (async() =>{
          let showInsuredBtn = document.getElementById("insuredFlights");
          showInsuredBtn.addEventListener("click", showInsuredFlights);
        })();

        async function displayAirlines() {
            let airline = contract.airlines;
            let airlinesElement = document.getElementById("showRegisteredAirlines");
            airlinesElement.innerHTML = "";
            let table = document.createElement("table");
            let tableHeaders = `
            <tr><th>Address</th>
            <th>Paid</th>
            <th>Registered</th>
            <th>Vote To Add</th>
            </tr>`;
            table.innerHTML = tableHeaders;
            let numberOfAirlines = await contract.getNumberOfAirlines();
            console.log(Number(numberOfAirlines));
            console.log(contract.airlines);
            for(let i = 0; i < numberOfAirlines; i++) {
              let address = contract.airlines[i];
              let airlineInfo = await contract.getAirline(address);
              let tableRow = document.createElement("tr");
              let tableData = document.createElement("td");
              tableData.innerHTML = address;
              let tableData2 = document.createElement("td");
              tableData2.innerHTML = airlineInfo[1];
              let tableData3 = document.createElement("td");
              tableData3.innerHTML = airlineInfo[2];
              let tableData4 = document.createElement("td");
              tableData4.innerHTML = airlineInfo[3];
              table.appendChild(tableData);
              table.appendChild(tableData2);
              table.appendChild(tableData3);
              //table.appendChild(tableData4);

              if(!airlineInfo[2]) {
                let tableData5 = document.createElement("td");
                let btn = document.createElement("button");
                btn.innerHTML = "Vote"

                btn.addEventListener("click", async function() {
                  let voter = document.getElementById("selectAddress").value;
                  await contract.vote(address,voter);
                  alert("Vote has been cast");
                });

                tableData5.appendChild(btn);
                table.appendChild(tableData5);

              }

              table.appendChild(tableRow);
            }
              airlinesElement.appendChild(table);
            };
        });

})();
