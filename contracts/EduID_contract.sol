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
    struct PermissionInfo{
        string rdId;
        string rdHash;
        address[] rdPermissions;
        uint permissionType;
    }

    //permission Type
        // 0 = tidak dapat diakses siapapun selain pemilik
        // 1 = semua nodes memiliki akses
        // -1 = hanya member tertentu yang memiliki akses]

    mapping (string => PermissionInfo) public RdPermissionMap;
    string[] public RdPermissionHashArray;

    function updateRdPermissions(string memory _rdHash, address blockAddress, uint operation) public returns (bool) {
        if (operation == 1) {
            if (RdPermissionMap[_rdHash].permissionType == 1) {
                return true;
            }
            if (RdPermissionMap[_rdHash].permissionType == 0) {
                return false;
            }
            RdPermissionMap[_rdHash].rdPermissions.push(blockAddress);
            return true;
        }

        if(operation == 0) {
            for (uint i =0; i<=RdPermissionMap[_rdHash].rdPermissions.length; i++) {
                if (RdPermissionMap[_rdHash].rdPermissions[i] == blockAddress) {
                    delete RdPermissionMap[_rdHash].rdPermissions[i];
                    RdPermissionMap[_rdHash].rdPermissions.pop;
                    return true;
                }
                return false;
            }
        }
    }

    function isExistPermission(string memory _rdHash, address blockAddress) public view returns (bool) {
        if (RdPermissionMap[_rdHash].permissionType == 1) {
            return true;
        }
        if (RdPermissionMap[_rdHash].permissionType == 0) {
            return false;
        }
        for (uint i =0; i<=RdPermissionMap[_rdHash].rdPermissions.length; i++) {
            if (RdPermissionMap[_rdHash].rdPermissions[i] == blockAddress) {
                return true;
            }
        }
        return false;
    }
}

contract RSSC {

}