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
        bool agreeToJoin;
    }

    InstitutionInfo[] public institutionInfoMap;

    mapping(address => InstitutionInfo) public PubKeyInstitutionInfoMap;

    function initInstitutionMap(
        address blockAddress, 
        string memory _namaInstitusi,
        uint _NPSN,
        string memory _akreditasi,
        string memory _jenisSekolah,
        string memory _alamatInstitusi,
        uint _nomorTelepon,
        bool _agreeToJoin) public returns (bool) {
            blockAddress = msg.sender;

            institutionInfoMap.push(InstitutionInfo({
                namaInstitusi: _namaInstitusi,
                NPSN : _NPSN,
                akreditasi : _akreditasi,
                jenisSekolah : _jenisSekolah,
                alamatInstitusi : _alamatInstitusi,
                nomorTelepon : _nomorTelepon,
                agreeToJoin : _agreeToJoin
            }));
        }
    
    function isExistInstitution(uint _NPSN) public view returns (bool) {
        for (uint i=0; i <= institutionInfoMap.length; i++) {
            if (institutionInfoMap[i].NPSN == _NPSN) {
                return true;
            }
        return false;
        }
    }
}

contract RSSC {

}

contract RPCC {
    
}