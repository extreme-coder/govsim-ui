export default function HowToPlay() {
  return (
    <div className="container">
      <h1>Overview</h1>
      <p>
        Welcome to NationBuildr, a simulation of parliamentary politics where you can take on the role of a political party and compete to win simulated votes and pass bills. In this game, you will campaign to gain support from the population and form coalitions with other parties to increase your chances of success. You will also participate in parliamentary proceedings by proposing and voting on bills that can change the laws of the land.
      </p>
      <h1>Game Interface</h1>
      <p>The main screen is divided into several sections that allow you to access the different aspects of the game.</p>
      <p>At the top of the screen, you will see the turn tracker, which shows whose turn it is and how many turns are left in the game. Next to the turn tracker, you will find the party card section, which displays all the players in the game and their current scores.</p>
      <p>On the left-hand side of the screen, you will see the Demographics section, which shows the population of the country and their interests. This information is important for developing your campaign platform and gaining support from the population.</p>
      <p>To the right of the demographics section is your current platform. This is where you can add promises and goals that you hope to achieve if you win the election. You can also propose bills from this section and call for a vote in parliament.</p>
      <p>In the same area as your platform, there's an "Other Bills" tab, which shows the bills that have been proposed by other players. This section is where you can see the bills which other players are proposing.</p>
      <p>Finally, at the bottom of the screen, youcan create and manage promotions for your party. This is where you can spend money on advertisements to gain support from the population.</p>
      <h1>Campaigning</h1>
      <p>In NationBuildr, winning elections is crucial to gaining power and passing laws. To win, you'll need to campaign effectively by gaining support from various interest groups in the country.</p>
      <h3>Promises</h3>
      <p>Promises are exactly what they sound like: they're things which your party will <i>promise</i> to do once in power. To win, you will need to make promises in your party's platform that appeal to the different interest grous in the country.</p>
      <p>An interest group is a group of like-minded people who support similar laws, such as farmers or students. To see what groups exist in your country and how much support they have, check the "Demographics" and "Approval Ratings" sections of the game interface. These will show you the different interest groups, their percentage of the population, and how much support they currently have for your party. Your job as a politician is to try and gain the support of enough of these interest groups to win votes, by adding promises to your platform which they support.</p>
      <p>To add promises to your party's platform when its your turn, click the "Create a Bill" card. You can then choose the department your promise falls under, the type of law you want to change, and the law you want to change it too. Choose wisely, as interest groups who like the law you pick will have a higher chance of voting for you, and groups that don't will be... less than happy with your party. Also make sure to pick laws which you think have a chance of passing in parliament; nobody likes a party who can't get their promises passed!</p>
      <p>Of course, other players are also going to be hard at work making promises, competing with you for votes. To help your side win, you can spend campaign money on promotions. Promotions are a way to get your party's name out there; they represent the money you spend on ad campaigns, billboards, free bumper stickers, etc. To create a promotion, click the "Promote Bill" card, and choose the bill you're promoting and how much money you want to spend on it. The more money you spend, the more support you'll get from people who like the bill. Campaign money doesn't grow on trees, so be strategic about which bills you promote!</p>
      <p>If you really want to compete with another party, you can click the "Oppose Bill" card. This will allow you to choose another party's bill and run negative ad campaigns against it, decreasing the amount of people who will vote for that party. Once again, you have to be strategic with your money; choose the parties which are the biggest threat to your electoral success.</p>
      <p>As you campaign and gain support from different interest groups, you will see your Approval Ratings start to change in your favor. Keep an eye on this graph and adjust your promises and promotions accordingly to gain the most support possible. Remember, the more support you have, the better your chances of winning elections, passing laws, and scoring points! Also make sure to keep an eye on how many turns you have left, as each player gets a limited number of turns to campaign.</p>
      <h1>The Elections</h1>
      <p>Once everyone is done campaigning, it's time for the elections to commence! When everyone is ready, elections will begin, and soon voting will finish and everybody will be able to see how many seats their party got.</p>
      <p>Of course, countries in NationBuildr use a proportional representation system, so one party gaining a majority is extremely rare. That's where coalitions come in!</p>
      <p>In real politics, a coalition is an agreement between two or more parties to vote as a group on bills. Of course, a bill needs a majority of votes in parliament to be passed, so for coalitions to be effective, they should be composed of parties which in total have a majority of seats.</p>
      <p>During the coalition phase, you can create coalitions with other parties. You can also discuss with your coalition members in a group chat. </p>
      <h1>Parliament</h1>
      <p>After the debate, it's time to vote on the bill. Players can either vote for or against the bill, or choose to abstain. A bill needs a majority of votes to pass, so it's important to try to convince others to vote in favor of the bill.</p>
      <p>If a bill passes, the player who proposed the bill will receive 400 points, and everyone who voted for it will receive 100 points. If the bill fails, nobody gets any points.</p>
      <h1>Scoring Points</h1>
      <h1>Tips & Strategies</h1>
      <p>NationBuildr is a complex simulation, with lots of variables, and plenty of opportunities to outmaneuver your opponents and achieve parliamentary victory. Here are some tips and strategies to keep in mind as you play:</p>
      <ul>
        <li>Know Your Base: Understanding the demographics of your country is crucial for creating an effective campaign strategy. Figure out which interest groups are most likely to support you, and which groups you need in order to win, and focus your attention on them. Consider not just a group's population, but their wealth, as having richer supporters will allow you to spend more money on your campaign.</li>
        <li>Invest in promotions: Promotions are an effective way to get your party's name out there and increase your visibility. Spend a lot of money on the issues which are the most contentious across the campaign, and on the bills which your base likes the most. Don't forget negative campaigns either; make sure to attack parties which are competing for the interest groups you want to attract.</li>
        <li>Build Coalitions: Forming coalitions with other parties can increase your chances of passing bills and gaining support in parliament. Look for parties with similar platforms to form alliances. Just remember that politics is a cutthroat game, and that you can betray your coalition partners anytime to advance your position.</li>
        <li>Pass Bills: Parties which can't keep enough of their promises suffer huge losses when elections roll around. Make sure you create promises which are realistic, and that you know who to ally with to pass bills once in parliament.</li>
      </ul>
      <p>Remember, parliamentary politics is all about strategy and compromise, and NationBuildr is no different. By building a strong platform, investing in promotions, forming coalitions, and prioritizing bills strategically, you'll be well on your way to success!</p>
    </div>
  )
}