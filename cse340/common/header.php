<img id="logo" src="/phpmotors/images/site/logo.png" alt="PHP Logo">

<?php if(isset($_SESSION['loggedin'])) {
        if ($_SESSION['loggedin'] === TRUE) {
            echo '<a id="account" class="acc" href="/phpmotors/accounts/index.php/?action=Logout">Logout</a>';}
 } else {
     echo '<a id="user-account" class="acc" href="/phpmotors/accounts/index.php/?action=login">My Account</a>';
        } ?> 


<?php 
if(isset($_SESSION['loggedin'])) {
    $user = $_SESSION['clientData']['clientFirstname'];
    echo "<a id='user' class='acc' href='/phpmotors/accounts/'>Welcome $user</a>";
}
?>
