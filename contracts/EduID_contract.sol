// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract ISSC {
    struct InstitutionInfo{
        string namaInstitusi;
        uint NPSN;
        string akreditasi;
        string jenisSekolah;
        string alamatInstitusi;
        uint nomorTelepon;
    }

    InstitutionInfo[] public institutionInfoMap;

    // mapping address to Institution Info
    mapping(address => InstitutionInfo) public PubKeyInstitutionInfoMap;
    address[] public institutionBlockAddressArray;

    function initInstitutionMap(
        address blockAddress, 
        string memory _namaInstitusi,
        uint _NPSN,
        string memory _akreditasi,
        string memory _jenisSekolah,
        string memory _alamatInstitusi,
        uint _nomorTelepon) public returns (bool) {
            
            require(blockAddress == msg.sender);

            // institutionInfoMap.push(InstitutionInfo({
            //     namaInstitusi: _namaInstitusi,
            //     NPSN : _NPSN,
            //     akreditasi : _akreditasi,
            //     jenisSekolah : _jenisSekolah,
            //     alamatInstitusi : _alamatInstitusi,
            //     nomorTelepon : _nomorTelepon,
            //     agreeToJoin : _agreeToJoin
            // }));

            //append data to mapping
            PubKeyInstitutionInfoMap[blockAddress].namaInstitusi = _namaInstitusi;
            PubKeyInstitutionInfoMap[blockAddress].NPSN = _NPSN;
            PubKeyInstitutionInfoMap[blockAddress].akreditasi = _akreditasi;
            PubKeyInstitutionInfoMap[blockAddress].jenisSekolah = _jenisSekolah;
            PubKeyInstitutionInfoMap[blockAddress].alamatInstitusi = _alamatInstitusi;
            PubKeyInstitutionInfoMap[blockAddress].nomorTelepon = _nomorTelepon;


            //store address to array
            institutionBlockAddressArray.push(blockAddress);

            return true;

        }
    
    // function isExistInstitution(uint _NPSN) public view returns (bool) {
    //     for (uint i=0; i <= institutionInfoMap.length; i++) {
    //         if (institutionInfoMap[i].NPSN == _NPSN) {
    //             return true;
    //         }
    //     return false;
    //     }

    function isExistInstitution(address _blockAddress) public view returns (bool) {
        for (uint i=0; i <= institutionBlockAddressArray.length; i++) {
            if (_blockAddress == institutionBlockAddressArray[i]) {
                return true;
            }
            return false;
        }
    }
}


contract RPCC {
    
}

contract RSSC {

}