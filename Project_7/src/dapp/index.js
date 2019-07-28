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
                showBalanceBtn.innerHTML = "Show contract balance";
                showBalanceBtn.setAttribute("class", "btn btn-primary");
                showBalanceBtn.addEventListener("click", async function() {
                    let currentBalance = await contract.getContractBalance();
                    alert(`Current contract balance is: ${currentBalance / 10**18} ether`);
                });
                contractOwnerElement.appendChild(showBalanceBtn);

            } catch(e) {
                console.log(e);
            }
        })();




    });


})();
