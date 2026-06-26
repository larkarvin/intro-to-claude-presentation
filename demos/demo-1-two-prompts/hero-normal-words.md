Build a fullscreen hero landing page in a new folder called `landing-hero-normal-prompt`. It's for a developer called ARBEN, using React, Tailwind CSS, and Vite. The page is a single screen-height section with a looping    
background video, and all the content layered on top of it. Keep everything in one App.tsx component, use React 
state for the mobile menu toggle, and skip routing.                                                             
                                                                                                                
For the background, use a looping video of an aurora over the Milky Way                                         
(https://media.istockphoto.com/id/1677482278/video/aurora-green-and-milky-way-galaxy-over-horizon-loop-35mm.mp4?
s=mp4-640x640-is&k=20&c=w4rQ7VXL69w64I4VKTsZebLvgZfUzza7cOTrP2Mmcn4=). It should autoplay, stay muted, loop     
forever, and play inline. Stretch it to cover the whole section, cropping to fill, with the framing pulled a bit
toward the right of center. It sits behind everything else.                                                     
              
Load two fonts. The first is a bold display font called "FSP DEMO - PODIUM Sharp 4.11" (from
https://db.onlinewebfonts.com/c/8b75d9dcff6a48c35a46656192adf019?family=FSP+DEMO+-+PODIUM+Sharp+4.11) — use it
for the brand name and the big headline, and wire it into Tailwind as podium. The second is Inter from Google
Fonts — use it for everything else (nav, body copy, stats, buttons), wired in as inter. Pull icons from
lucide-react.

Across the top, place a navbar with generous, comfortable padding that opens up a little more on larger screens.
The brand name "ARBEN" sits on the left in the display font — fairly large, bold, uppercase, with the letters
spaced noticeably apart. In the middle, four uppercase nav links — Projects, Who We Are, Services, Contact —
kept small with wide letter-spacing, in a muted white that brightens on hover. On the right, a bordered "Contact
Me" button with a small arrow icon, with roomy padding and tiny, widely-spaced uppercase text. On smaller
screens, hide the middle links and the button, and show a simple three-bar hamburger instead, with the bottom
bar a touch shorter than the others.

When the hamburger is tapped, open a full-screen dark, blurred overlay that fades in smoothly. It repeats the
brand name up top with a close (X) icon, and stacks the four nav links large — much bigger than the navbar links
— and centered in the display font, each animating in one after another with a short, even stagger. Put a
"Contact Me" button below them with the same entrance feel. Tapping any link closes the overlay.

The hero content sits vertically centered and left-aligned, and everything fades up into place with a gentle
staggered delay, each element arriving a beat after the one above it.

- A small tagline with a crown icon: "Digital Product Engineering" — very small, light-gray, uppercase, with
dramatically wide letter-spacing. Leave clear breathing room beneath it.
- A big three-line headline in the display font, white and uppercase, with the lines stacked tightly together
and slightly condensed spacing. This is the largest text on the page — it should scale fluidly so it stays
dominant on big screens but never overflows on small ones: "Web Plumber." / "Developer." / "Problem Solver."
- A short paragraph of supporting copy in light gray, modest in size with relaxed line spacing, held to a narrow
column: "Making the web better" followed by, in solid white, "one line of code at a time." Give it a bit of
space above.
- A call-to-action row spaced comfortably below: a black "SEE MY WORK" button with small, widely-spaced
uppercase text and an arrow that nudges on hover, and next to it (hidden on mobile) an award icon paired with
two small muted labels, "Project" / "Case Studies".
- A stats row sitting well below the buttons, with wide gaps between each figure: three large bold white
numbers, each with a tiny, light-gray, widely-spaced uppercase label tucked just underneath — "200+ — Successful
Integrations", "10+ — Years of building software", "90% — Automated Workflows". Let it wrap on small screens.

Make the whole thing fully mobile-responsive and mobile-first. Sizes, padding, gaps, and margins should all
start compact on phones and grow progressively roomier as the screen widens. The nav links and Contact button
only appear on larger screens, the hamburger menu takes over on small ones, and the call-to-action and stats
rows wrap instead of overflowing.
