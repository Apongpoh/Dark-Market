import Menu from '../../components/menu';
import styles from '../../styles/Vendor.module.css';


export default function FAQs() {
    return (
        <div>
            <Menu />
            <div className={styles.misc}>
                <h2 style={{textAlign: 'center', color: 'black'}}>FAQs</h2>

                <h3>What information is required during registration or profile update?</h3>
                <p>An anonymous user name and strong password. Avoid putting information that may reveal your true identity, such as real-life website, name or any piece of information that would allow somebody to find out who you really are. We value the privacy and safety of our users. <strong>Note</strong> your user name cannot be changed.</p>
                
                <h3>How can I become a vendor?</h3>
                <p>Read the information on the ‘BECOME A VENDOR’ page. You will need to follow the vendor rules and pay the vendor fee. Vendors are required to set up 2FA to secure their account. If you are caught scamming, padding feedback or breaking any other rule your vendor account will be revoked and you could be banned.</p>
                
                <h3>I'm a vendor, how do I make a PGP key?</h3>
                <p>Vendors must have PGP key enabled, if you don't know how to do this, look for it on google! It will take you 3 minutes to setup and you will be ready to sell! It is always recommended for customers too to have PGP.</p>
                
                <h3>I'm a vendor, how do I dispatch new orders?</h3>
                <p>Go to Sales, then click on Order Messages/Dispatch Order to dispatch order to customer. Remember to Mark order as Shipped afterwards otherwise you will not get payed!</p>
                
                <h3>I'm a customer, how do I see my order?</h3>
                <p>Go to Messages, then click Orders. Remember to finalize order once you confirmed the goods.</p>
                
                <h3>I'm a vendor, how do i delete a listing?</h3>
                <p>Click <strong>Vendor</strong> on Menu, <strong>Manage Listing</strong>, click <strong>Delete</strong>. It will permanently remove listing.</p>
            
                <h3>How do I create and add funds to my wallet account?</h3>
                <p>Open wallet by clicking on <strong>wallet</strong> on Menu. Create a wallet account by filling the form. <strong>Note</strong> choose a passphrase different from your regurlar Sign In password. A deposit address for the wallet account is automatically generated. Click <strong>Receive</strong> on the side Menu. Scan the QR code of the selected wallet or copy its respective address below and send funds to the address. For convenience, security and privacy reason you need to create a new deposit address for every new deposit.</p>
                
                <h3>How do I withraw funds from my account?</h3>
                <p>Open wallet by clicking on the <strong>wallet</strong> on Menu. Click <strong>Send</strong> on the side Menu. Select wallet account and fill in the required fields.<strong>Note</strong> your wallet account passphrase is required for these operation.</p>

                <h3>My deposit hasn’t showed up?</h3>
                <p>Deposits are credited when the transaction receives 5 confirmations on the blockchain. You should check your fee because low fee causes slow transaction times in a congested Bitcoin network.</p>
                
                <h3>I deposited twice or more to the same address?</h3>
                <p>You are meant to generate a new deposit address for every new deposit, if you send two or more deposits to the same address you can only withraw the respective funds accordingly. That is if you deposit 0.2 BTC, and later 0.44 BTC on address <strong>'bcq1xxx'</strong> that gives a balance of 0.64 BTC. The withrawal process is as follow, withraw either 0.44 BTC and then 0.64 BTC, or vice versa. Fee is not included here for demostration purpose. Remember for convenience, security and privacy reason you need to create a new deposit address for every new deposit.</p>
                
                <h3>What currencies does Terre Market support?</h3>
                <p>Bitcoin.</p>
                
                <h3>What do I do if i forget my logging password?</h3> 
                <p>You automatically lose access to your account. You must always remember your password whereas you can only change your password.</p>
                
                <h3>What do I do if i forget my wallet passphrase?</h3> 
                <p>You automatically lose access to withdraw funds from your wallet account. You must always remember your passphrase. Make a backup of each wallet account created. Each wallet account can have different passphrase.</p>
                
                <h3>How does escrow work for digital listings?</h3>
                <p>Once you purchase the listing it will be marked as processing, the vendor has 48 hours to complete the order by sending the digital item then marking the order as shipped otherwise the order will be cancelled. Once the order has been marked as shipped the buyer can either finalize the order once they have received the purchase, dispute the order if there is a problem or extend escrow if required. If the buyer does nothing once the order is marked as shipped it will auto-finalize after being marked as shipped for 48 hours.</p>
                
                <h3>How does escrow work for physical listings?</h3>
                <p>Once you purchase the listing it will be marked as processing, the vendor has 72 hours to ship the order and mark the order as shipped otherwise it will be cancelled. Once the order has been marked as shipped the buyer can either finalize the order once they have received it, dispute the order if there is a problem or extend escrow if required. If the buyer does nothing once the order is marked as shipped it will auto-finalize after being marked as shipped for 14 days.</p>
                
                <h3>Are all listings done through escrow?</h3>
                <p>Yes. Any transactions done outside Terre Market is at your own risk.</p>
                
                <h3>How can I become a FE vendor?</h3>
                <p>Finalize Early is not allow. We recommend transactions goes through escrow.</p>
                
                <h3>How can I leave feedback for an order?</h3>
                <p>After the order has finalized you have 30 days to leave the appropriate feedback.</p>
                
                <h3>What do I do if i’m experiencing a glitch or bug?</h3>
                <p>Create a support ticket and explain what is happening for you.</p>

                <h3>Which devices support Terre Market</h3>
                <p>The market is designed to be used on a PC, Tablet and Mobile. PC is recommended for better user experience.</p>
                
                <h3>What do I do if i’ve been scammed?</h3>
                <p>Create a support ticket and explain the situation, you can also write up a scam report in the scam report category on the forum. To prevent being scammed you should fully utilize escrow, this means don’t finalize the order if you haven’t received it and dispute the order or extend the escrow if required.</p>
                
            </div>
        </div>
    );
}