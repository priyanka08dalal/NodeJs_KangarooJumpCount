//  Add User
function addUser() {
    var entry = {
        sn: 'test1',
        objectclass: 'inetOrgPerson'
    };
    client.add('cn=TestUser1,ou=users,ou=system', entry, function (err) {
        if (err) {
            console.log("err in new user " + err);
        } else {
            console.log("added user")
        }
    });
  }
  
  // Add User to the Group
  
  function addUserToGroup(groupname) {
    var change = new ldap.Change({
        operation: 'add',
        modification: {
            uniqueMember: 'cn=TestUser1,ou=users,ou=system'
        }
    });
  
    client.modify(groupname, change, function (err) {
        if (err) {
            console.log("err in add user in a group " + err);
        } else {
            console.log("added user in a group")
        }
    });
  }