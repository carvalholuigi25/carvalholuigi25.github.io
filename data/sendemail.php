<?php 
    if(isset($_POST["send"])) {
        $to = $_POST["to"];
        $subject = $_POST["subject"];
        $message = $_POST["message"] . "\r\n" . "Sended by: " . $_POST["firstname"] . " " . $_POST["lastname"];
        $headers = 'From: '.$_POST["from"]."\r\n".
        'Reply-To: '.$_POST["to"]."\r\n".
        'X-Mailer: PHP/' . phpversion();
    
        $m = mail($to, $subject, $message, $headers);
        
        if($m) {
            echo "<p>Success: Your mail has been sended to " . $_POST["to"] . "!";
        } else {
            echo "<p>Error: Your mail has failed to send " . $_POST["to"] . "! Please try it again later or contact the <a href='mailto:carvalholuigi25@gmail.com'>administrator</a> of this website.</p>";
        }
    } else {
        echo '
        <form action="sendemail.php" method="post">
            <input type="hidden" name="to" value="carvalholuigi25@gmail.com" style="width: 100%;" />
            <br />
            <label for="firstname">First Name</label><br>
            <input type="text" name="firstname" value="" placeholder="Write your first name here" style="width: 100%;" />
            <br /><br />
            <label for="lastname">Last Name</label><br>
            <input type="text" name="lastname" value="" placeholder="Write your last name here" style="width: 100%;" />
            <br /><br />
            <label for="from">Email</label><br>
            <input type="email" name="from" value="" placeholder="Write your email here" style="width: 100%;" />
            <br /><br />
            <label for="subject">Subject</label><br>
            <input type="text" name="subject" value="" placeholder="Write any subject you want here" style="width: 100%;" />
            <br /><br />
            <label for="message">Message</label><br>
            <textarea name="message" placeholder="Write any message you want here" style="width: 100%;"></textarea>
            <br /><br />
            <input type="reset" class="btnreset" value="Reset" />
            <input type="submit" name="send" class="btnsubmit" value="Send" />
        </form>';
    }
?>
