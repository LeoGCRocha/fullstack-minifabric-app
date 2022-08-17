package main

import (
	"encoding/json"
	"log"
	"math/rand"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	peer "github.com/hyperledger/fabric-protos-go/peer"
)

type GenericExample struct {
}

type UserAccount struct {
	ID      string `json: "ID"`
	Name    string `json: "Name"`
	Balance int    `json:"Balance"`
}

func (t *GenericExample) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

// Invoke function
func (t *GenericExample) Invoke(stub shim.ChaincodeStubInterface) peer.Response {

	fn, args := stub.GetFunctionAndParameters()
	switch fn {
	case "Input":
		if len(args) != 2 {
			return shim.Error("Invalid number of parameters to this fucntion, was expected 0.")
		}
		var user = UserAccount{
			ID:      args[0],
			Name:    args[1],
			Balance: rand.Intn(10000),
		}
		jsonData, err := json.Marshal(user)
		if err != nil {
			return shim.Error("Error on jsonMarshal at Input function.")
		}
		stub.PutState(user.ID, jsonData)
		return shim.Success(nil)
	case "Read":
		if len(args) != 1 {
			return shim.Error("Invalid number of parameters to this function, was expected 1.")
		}
		bytes, err := stub.GetState(args[0])
		if err != nil {
			return shim.Error("Invalid parameter to thisfunction.")
		}
		return shim.Success(bytes)
	default:
		return shim.Error("Invalid function name.")
	}
}

func main() {
	if err := shim.Start(new(GenericExample)); err != nil {
		log.Panicf("Error while trying to init the chaincode: %v", err)
	}
}
