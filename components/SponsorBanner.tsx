/**
 * The sponsor logo strip that sat above the menu on the original site.
 *
 * Avada set it as the header's background image (`--header_bg_image:
 * codebanner.jpg`, no-repeat, pinned top-left) rather than as content, so it
 * carried no alt text and scrolled away while only the menu bar stuck. Here it
 * is a real image with the sponsors named in `alt`; the sticky menu below is
 * unchanged.
 */
export function SponsorBanner() {
  return (
    <div className="border-b border-rule bg-white">
      <div className="mx-auto max-w-[1100px] px-5 py-4">
        <img
          src="/images/sponsor-banner.jpg"
          width={775}
          height={152}
          alt="Our sponsors: TD, Carleton University Faculty of Engineering and Design, Design 1st, capitalROBOT.ca, Makerspace North, OZ Optics, and Artengine."
          className="h-auto w-full max-w-[775px]"
        />
      </div>
    </div>
  )
}
