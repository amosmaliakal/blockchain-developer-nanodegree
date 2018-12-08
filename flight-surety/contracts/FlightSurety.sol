pragma solidity ^0.4.24;

// It's important to avoid vulnerabilities due to numeric overflow bugs
// OpenZeppelin's SafeMath library, when used correctly, protects agains such bugs
// More info: https://www.nccgroup.trust/us/about-us/newsroom-and-events/blog/2018/november/smart-contract-insecurity-bad-arithmetic/

import "node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

/************************************************** */
/* FlightSurety Smart Contract                      */
/************************************************** */
contract FlightSurety {
    using SafeMath for uint256; // Allow SafeMath functions to be called for all uint256 types (similar to "prototype" in Javascript)

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    bool private testingMode = false;       // Flag to enable easy testing
    bool private operational = true;        // Blocks all state changes throughout the contract if false
    address private contractOwner;          // Account used to deploy contract


    // In Solidity, all mappings always exist. "isRegistered" is a flag that can only be
    // "true" if it was set in code, so it's a good way to query items for mapping types.
    struct Airline {
        bool isRegistered;      // Flag for testing existence in mapping
        address account;        // Ethereum account
        uint256 ownership;      // Track percentage of Smart Contract ownership based on initial contribution
    }

    
    mapping(address => Airline) airlines;   // All registered airlines

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    event RegisterAirline   // Event fired when a new Airline is registered
                            (
                                address indexed account     // "indexed" keyword indicates that the data should be
                                                            // stored as a "topic" in event log data. This makes it
                                                            // searchable by event log filters. A maximum of three
                                                            // parameters may use the indexed keyword per event. 
                            );

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational);
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner);
        _;
    }

    /********************************************************************************************/
    /*                                       CONSTRUCTOR                                        */
    /********************************************************************************************/

    /**
    * @dev Contract constructor
    *
    */
    constructor
                            (                                 
                            ) 
                            public
    {
        contractOwner = msg.sender;
    }    

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/


   /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }

   /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    * @return A bool that is the new operational mode
    */    
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner 
    {
        operational = mode;
    }

   /**
    * @dev Sets testing mode on/off
    *
    * When testing mode is enabled, certain functions will behave differently (example: skip time-based delays)
    * @return A bool that is the new testing mode
    */   
    function setTestingMode
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner 
                            requireIsOperational
    {
        testingMode = mode;
    }


    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Check if an account is registered as an airline
    *
    * @return A bool that indicates if the account is an airline
    */   
    function isAirline
                            (
                                address account
                            )
                            external
                            requireIsOperational
                            view
                            returns(bool)
    {
        require(account != address(0));
        return airlines[account].isRegistered;
    }


   /**
    * @dev Register the caller as an airline
    *
    */   
    function registerAirline
                            (   
                            )
                            external
                            requireIsOperational 
    {
        require(!airlines[msg.sender].isRegistered); // Fail if airline is already registered

        airlines[msg.sender] = Airline({
                                    isRegistered: true,
                                    account: msg.sender,
                                    ownership: 0        
                              });

        emit RegisterAirline(msg.sender);   // Log airline registration event
    }

}   
