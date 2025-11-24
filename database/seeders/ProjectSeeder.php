<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Project 1
        Project::create([
            'project_name' => 'Against The Grain Epoxy',
            'website' => 'https://againstthegrainepoxy.com',
            'onboarding_notes' => 'website redesign for 1st month+ SEO from 2nd month + performance marketing from 4th month',
            'client_name' => 'Ryan',
            'email_address' => 'contact@againstthegrainepoxy.com',
            'phone_number' => '+1-555-0100',
            'assigned_to' => '27',
            'project_manager_id' => '20',
            'payment_amount' => 357.81,
            'payment_type' => 'monthly',
        ]);

        // Project 2
        Project::create([
            'project_name' => 'Axyloza',
            'website' => 'https://axyloza.com',
            'onboarding_notes' => 'Dropshipping Integration + GMC resolution + Website redesign + SEO + Ads Management',
            'client_name' => 'Alonzo',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '7',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // project 3
        Project::create([
            'project_name' => 'Bible Healing Oil',
            'website' => 'https://biblehealingoil.com',
            'onboarding_notes' => 'One time website redesign with 1 year website maintenance + ecom SEO and Performance Marketing ',
            'client_name' => 'Sam & Prof Gordon',
            'email_address' => 'info@biblehealingoil.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '7',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 4
        Project::create([
            'project_name' => 'Boreal Defense',
            'website' => 'https://orealdefense.com',
            'onboarding_notes' => 'eComm SEO + Peformance Marketing (third month onwards)',
            'client_name' => 'Sean',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '19',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 5
        Project::create([
            'project_name' => 'Brain Food',
            'website' => 'https://brainfoodmood.store',
            'onboarding_notes' => 'UI/UX Optimization, Comprehensive SEO +Performance Marketing',
            'client_name' => 'Megan',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '19',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 6
        Project::create([
            'project_name' => 'Chameleon Transfer',
            'website' => 'https://chameleontransfer.com',
            'onboarding_notes' => 'SEO + UXUI + Google Ads Management',
            'client_name' => 'Frank',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '33',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 7
        Project::create([
            'project_name' => 'Cheznous Shop',
            'website' => 'https://cheznousshop.com',
            'onboarding_notes' => '1st Month - niche and supplier finalization, 2nd month -  Website designing and 3rd month onwards - SEO and Google Ads',
            'client_name' => 'Willy',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '27',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 8
        // Project::create([
        //     'project_name' => 'Carolina Looms',
        //     'website' => 'https://#.com',
        //     'onboarding_notes' => 'Ecommerce SEO + Website redesign+ Google Ads management (Fixation of GMC included)',
        //     'client_name' => 'Axyloza',
        //     'email_address' => 'info@axyloza.com',
        //     'phone_number' => '+1-555-0200',
        //     'assigned_to' => '33',
        //     'project_manager_id' => '31',
        // ]);

        // Project 9
        Project::create([
            'project_name' => 'Dripnation IL',
            'website' => 'https://dripnationil.com',
            'onboarding_notes' => 'SXO + Google Ads',
            'client_name' => 'Eddie',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '7',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 10
        Project::create([
            'project_name' => 'Dtf Colorado',
            'website' => 'https://dtfcolorado.com',
            'onboarding_notes' => 'Ecommerce SEO + Website redesign+ Google Ads management (Fixation of GMC included)',
            'client_name' => 'Ibrahim Centiner',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '33',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 11
        Project::create([
            'project_name' => 'DTF Illinois',
            'website' => 'https://dtfil.com',
            'onboarding_notes' => 'Ecommerce SEO + Website redesign+ Google Ads management (Fixation of GMC included)',
            'client_name' => 'Ibrahim Centiner',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '33',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 12
        Project::create([
            'project_name' => 'DTF North Carolina',
            'website' => 'https://dtfnc.com',
            'onboarding_notes' => 'Ecommerce SEO + Website redesign+ Google Ads management (Fixation of GMC included)',
            'client_name' => 'Ibrahim Centiner',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '33',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 13
        Project::create([
            'project_name' => 'DMI Audio',
            'website' => 'https://dmiaudio.com',
            'onboarding_notes' => 'Website redesign+setting up of google tools+ecom SEO+Performance marketing (google&meta)',
            'client_name' => 'Matt',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '19',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 14
        Project::create([
            'project_name' => 'Debras Passion Boutique',
            'website' => 'https://debraspassionboutique.com',
            'onboarding_notes' => 'SEO + PM + UXUI',
            'client_name' => 'Debra',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '19',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 15
        Project::create([
            'project_name' => 'Eye Candy Brow Salon',
            'website' => 'https://eyecandybrowsalon.com',
            'onboarding_notes' => 'Local SEO - Enterprise plan + Complete website redesign',
            'client_name' => 'Crystal',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '7',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 16
        Project::create([
            'project_name' => 'Elevate Dermal',
            'website' => 'https://elevatedermal.com',
            'onboarding_notes' => 'SEO + UX/UI + Performance marketing',
            'client_name' => 'Luis',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '19',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 17
        Project::create([
            'project_name' => 'Furloom',
            'website' => 'https://www.furloom.com/',
            'onboarding_notes' => 'Social Media Management + Social Media Marketing (from 2nd month onwards)',
            'client_name' => 'Alex',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            //'assigned_to' => '',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 18
        Project::create([
            'project_name' => 'Gadget Gangsterz',
            'website' => 'https://gadgetgangsterz.com',
            'onboarding_notes' => 'SEO + UXUI + Google Ads',
            'client_name' => 'Malik',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '7',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 19
        // Project::create([
        //     'project_name' => 'Gadgets Make Life Easier',
        //     'website' => 'https://gadgetsmakelifeeasier.com',
        //     'onboarding_notes' => 'Drop shipping and Webiste Revamp in 1st month + 2nd month onwards SEO+ Ads Management from 3rd month',
        //     'client_name' => 'Axyloza',
        //     'email_address' => 'info@axyloza.com',
        //     'phone_number' => '+1-555-0200',
        //     'assigned_to' => '21',
        //     'project_manager_id' => '31',
        // ]);

        // Project 20
        Project::create([
            'project_name' => 'General Wear Inc',
            'website' => 'https://generalwearinc.com',
            'onboarding_notes' => 'Local SEO - Business + GMB Optimization, One-time UXUI, Google Ads Management',
            'client_name' => 'Sandro',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '7',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 21
        Project::create([
            'project_name' => 'Global Cable Wire',
            'website' => 'https://globalcablewire.com',
            'onboarding_notes' => 'SEO and Performance Marketing + Social Media for 4 months ',
            'client_name' => 'Alex',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '27',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 22
        Project::create([
            'project_name' => 'Healthify Daily',
            'website' => 'https://healthifydaily.com/',
            'onboarding_notes' => 'Drop Shipping + SEO + UXUI + Ads Management (Performance based)',
            'client_name' => 'Clyde',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '39',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 23
        Project::create([
            'project_name' => 'Garage Out Post',
            'website' => 'https://garagepost.com',
            'onboarding_notes' => '500USD/month Onetime technical seo with performance Marketing',
            'client_name' => 'Jason',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '34',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 24
        Project::create([
            'project_name' => 'Halo Works',
            'website' => 'https://haloworks.ca',
            'onboarding_notes' => 'One-time website redesign +GMC/GMB setup',
            'client_name' => 'Maureen',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '19',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 25
        Project::create([
            'project_name' => 'Home of Apparels',
            'website' => 'https://homeofapparels.com ',
            'onboarding_notes' => 'Website Redesign + Ecom SEO + Ads Management (Meta and Google)',
            'client_name' => 'Nageena',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '21',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 26
        Project::create([
            'project_name' => 'JC Bags',
            'website' => 'https://jcbags.com',
            'onboarding_notes' => 'SEO + UXUI + 2 month Ads management free and after 15%',
            'client_name' => 'John',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '19',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 27
        // Project::create([
        //     'project_name' => 'JD Wood Craft NWA',
        //     'website' => 'https://jdwoodcraftnwa.com',
        //     'onboarding_notes' => 'Ecommerce SEO+ Performance Marketing',
        //     'client_name' => 'Axyloza',
        //     'email_address' => 'info@axyloza.com',
        //     'phone_number' => '+1-555-0200',
        //     'assigned_to' => '21',
        //     'project_manager_id' => '20',
        // ]);

        // Project 28
        Project::create([
            'project_name' => 'Jones Group Chicago',
            'website' => 'https://jonesgroupchicago.com',
            'onboarding_notes' => 'Website Redesign',
            'client_name' => 'Shawn',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '40',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 29
        Project::create([
            'project_name' => 'Karsten Nursery',
            'website' => 'https://karstennursery.com',
            'onboarding_notes' => 'Website Designing, Ecommerce Seo and Performance Marketing',
            'client_name' => 'Joel',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '33',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 30
        Project::create([
            'project_name' => 'Ladder Safety Rails',
            'website' => 'https://laddersafetyrails.com',
            'onboarding_notes' => 'SEO+ Ads Management',
            'client_name' => 'Sean',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '21',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 31
        Project::create([
            'project_name' => 'Modern Sauna Spa',
            'website' => 'https://modernsaunaspa.com',
            'onboarding_notes' => 'Ecommerce SEO + Performance Marketing (Google/Meta)',
            'client_name' => 'Tim',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '27',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 32
        Project::create([
            'project_name' => 'My Immunovet',
            'website' => 'https://myimmunovet.com',
            'onboarding_notes' => 'Website Redesign + eCommerce SEO',
            'client_name' => 'Drew',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '19',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 33
        Project::create([
            'project_name' => 'Memorial Envoy',
            'website' => 'https://memorialenvoy.com/',
            'onboarding_notes' => 'Website design and development',
            'client_name' => 'Brian',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '40',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 34
        Project::create([
            'project_name' => 'Mango Petals',
            'website' => 'https://mangopetals.com',
            'onboarding_notes' => '1st month - One-time Technical SEO, Drop shipping integration, One time Website designing. Second month onwards - SMO + SM Ads management',
            'client_name' => 'Swetha',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '21',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 35
        Project::create([
            'project_name' => 'Nova Haven Living',
            'website' => 'https://novahavenliving.com',
            'onboarding_notes' => '750USD for first 2 month and then 1050USD from third month Suppliers research, product listing, Website redesigning, SEO and performance marketing',
            'client_name' => 'Rahmat',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '21',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 36
        Project::create([
            'project_name' => 'Only 3 Snacks',
            'website' => 'https://only3snacks.com',
            'onboarding_notes' => 'One time Seo and Performance Marketing ',
            'client_name' => 'Damion',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '21',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 37
        Project::create([
            'project_name' => 'Ochi Shop',
            'website' => 'https://ochishop.com',
            'onboarding_notes' => ' SEO and UX/UI',
            'client_name' => 'Katie',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '7',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 38
        // Project::create([
        //     'project_name' => 'Pro Ager',
        //     'website' => 'https://proager.com',
        //     'onboarding_notes' => 'finalising suppliers, assistance in making website live,SEO and Performance marketing',
        //     'client_name' => 'Axyloza',
        //     'email_address' => 'info@axyloza.com',
        //     'phone_number' => '+1-555-0200',
        //     'assigned_to' => '21',
        //     'project_manager_id' => '31',
        // ]);

        // Project 39
        Project::create([
            'project_name' => 'Prodigy Life Pro',
            'website' => 'https://prodigylifepro.com',
            'onboarding_notes' => 'Performance Marketing / SEO given complementary for 2-3 months',
            'client_name' => 'Zlatan',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '34',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 40
        Project::create([
            'project_name' => 'Pro Wildfire Defense',
            'website' => 'https://prowildfiredefense.com',
            'onboarding_notes' => 'Website design + Local SEO + Google Ads after 3rd month',
            'client_name' => 'Bart Kimber',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '7',
            'project_manager_id' => '39',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        // Project 41
        Project::create([
            'project_name' => 'Pucks and Timepieces',
            'website' => 'https://pucksandtimepieces.com',
            'onboarding_notes' => 'Automation',
            'client_name' => 'Jeremy',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '34',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);
        
        //Project 42
        Project::create([
            'project_name' => 'Patio Elegance',
            'website' => 'https://patioelegance.com',
            'onboarding_notes' => 'SEO + Ads',
            'client_name' => 'Randy',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '21',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 43
        Project::create([
            'project_name' => 'Redemption Tactical',
            'website' => 'https://redemptiontactical.com',
            'onboarding_notes' => 'Business - SEO + UXUI + Performance Marketing',
            'client_name' => 'Adam',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '27',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 44
        Project::create([
            'project_name' => 'Rehisk',
            'website' => 'https://rehisk.com',
            'onboarding_notes' => 'SEO + UXUI + Google Ads Management + Youtube SEO',
            'client_name' => 'Kavin',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '27',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 45
        Project::create([
            'project_name' => 'Rejuv Rx',
            'website' => 'https://rejuv-rx.com',
            'onboarding_notes' => 'SEO + Ads',
            'client_name' => 'James Potter',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '19',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 46
        Project::create([
            'project_name' => 'Rug Resources',
            'website' => 'https://Rug-resources.com',
            'onboarding_notes' => 'Ecommerce SEO + Performance marketing',
            'client_name' => 'Adeel',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '19',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 47
        Project::create([
            'project_name' => 'So Desygn',
            'website' => 'https://sodesygn.com',
            'onboarding_notes' => 'SEO + One-time Website redesign + Ads Management - 3 blogs per month',
            'client_name' => 'Patricia',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '27',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 48
        Project::create([
            'project_name' => 'Shop Tiny Home Living',
            'website' => 'https://shoptinyhomeliving.com',
            'onboarding_notes' => 'SEO + UX/UI + Performance marketing',
            'client_name' => 'Wendell',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '21',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 49
        Project::create([
            'project_name' => 'Thrive Well Sport',
            'website' => 'https://thrivewellsport.com',
            'onboarding_notes' => 'SEO + UXUI + Performance Marketing',
            'client_name' => 'Sandy',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '7',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 50
        Project::create([
            'project_name' => 'Unik Construction',
            'website' => 'https://unikconstruction.net',
            'onboarding_notes' => 'Local SEO+ UXUI + Performance Marketing',
            'client_name' => 'Kavin',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '27',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 51
        Project::create([
            'project_name' => 'Zelixon',
            'website' => 'https://zelixon.com',
            'onboarding_notes' => 'Performance Marketing ',
            'client_name' => 'Matthias',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '19',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 52
        Project::create([
            'project_name' => 'Crates and Curious',
            'website' => 'https://cratesandcurios.com',
            'onboarding_notes' => 'UI/UX+ SEO+ Performance marketing',
            'client_name' => 'Joyross',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '13',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 53
        Project::create([
            'project_name' => 'Home Well Supplies',
            'website' => 'https://homewellsupplies.com',
            'onboarding_notes' => 'Website redesign+Setup of Google Properties+Competitor research+Ecom SEO+ Performance marketing',
            'client_name' => 'Yaniv',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '33',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 54
        Project::create([
            'project_name' => 'JV Beauty Supply',
            'website' => 'https://jvbeautysupply.com',
            'onboarding_notes' => 'Ecommerce SEO + Website Redesign + GMB Optimization + FB Market place + Google/Meta ads',
            'client_name' => 'Anthony',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '33',
            'project_manager_id' => '20',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 55
        Project::create([
            'project_name' => 'Lucia Friends',
            'website' => 'https://luciafriends.com',
            'onboarding_notes' => 'One-time Website design + Market Research (Products, pricing, collections,etc) + Drop shipping Integration + One-time Technical SEO ',
            'client_name' => 'Rajan',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '27',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

        //Project 56
        Project::create([
            'project_name' => 'Outtcom',
            'website' => 'https://outtcom.com',
            'onboarding_notes' => '(Inclined towards Online Reputation Management) - Basic SEO + Amazon Marketing (Main focus) + Backlinks on Quora/Reddit + Etsy Marketing + 1 blog per month',
            'client_name' => 'Fahaad',
            'email_address' => 'info@axyloza.com',
            'phone_number' => '+1-555-0200',
            'assigned_to' => '34',
            'project_manager_id' => '31',
            'payment_amount' => 500.00,
            'payment_type' => 'monthly',
        ]);

    }
}
