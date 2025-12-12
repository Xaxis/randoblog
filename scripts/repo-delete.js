#!/usr/bin/env node

const GITHUB_TOKEN = '';

const repos = [
    // 'Xaxis/bitcoin-quantum-expose',
    'Xaxis/hoard-the-coins-not-the-rules',
    'Xaxis/deficits-are-not-private-surplus',
    'Xaxis/how-to-talk-to-something-smarter',
    'Xaxis/super-intelligence-when-boundaries-fail',
    'Xaxis/basement-bitcoin-hash-plan',
    'Xaxis/bitcoin-weird-edges-real-risks',
    'Xaxis/proof-over-identity-bitcoiners-case-for-lock',
    'Xaxis/orangecheck-bitcoin-reputation-introduction',
    'Xaxis/broken-money-polarized-people',
    'Xaxis/wintering-well-how-to-cross-fourth-turning',
    'Xaxis/age-of-ai-mono-v-poly-culture',
    'Xaxis/mvnav-and-bitcoin-treasury-companies',
    'Xaxis/the-sats-first-shift',
    'Xaxis/a-lightning-flywheel-you-can-actually-run',
    'Xaxis/spacetime-fossil-curvatures',
    'Xaxis/magnets-minerals-and-bitcoin',
    'Xaxis/bitcoin-mad-to-map',
    'Xaxis/bitcoin-nuclear-non-proliferation-plan',
    'Xaxis/bitcoin-when-energy-gets-weird-with-fusion',
    'Xaxis/bitcoin-ai-that-pays-its-own-bills',
    'Xaxis/bitcoin-hide-keys-in-plain-sight',
    'Xaxis/fusion-in-2025',
    'Xaxis/an-open-console-that-could-actually-ship',
    'Xaxis/what-science-is-being-sat-on',
    'Xaxis/quantum-gravity-roadblocks-and-inroads',
    'Xaxis/dialing-up-speed-of-light',
    'Xaxis/bitcoin-and-home-buying-strategy',
    'Xaxis/arizona-radio-observatory-plan',
    'Xaxis/bitcoin-nonprofit-housing',
    'Xaxis/bitcoin-saves-humans-from-ai-redundancy',
    'Xaxis/quantum-brains-disembodied-ai',
    'Xaxis/how-bitcoin-quietly-defunds-the-fed',
    'Xaxis/metrics-to-metal-physical-warp-drives',
    'Xaxis/through-a-wormhole',
    'Xaxis/btc-ar-post',
    'Xaxis/detecting-the-graviton',
    'Xaxis/uapwatch-cubesat',
    'Xaxis/beyond-radio',
    'Xaxis/bitcoin-proof-of-ownership',
    'Xaxis/entangled-black-hole-network',
    'Xaxis/ftl-signalling',
    'Xaxis/wormhole-device',
    // 'Xaxis/uap-ufo-honeypot-sensor-project',
    // 'Xaxis/agentic-agi',
    // 'Xaxis/photonic-foundations',
    // 'Xaxis/ompsa',
    // 'Xaxis/modelling-consciousness'
];

async function deleteRepo(repo) {
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/vnd.github+json',
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        if (response.status === 204) {
            console.log(`✅ Deleted ${repo}`);
            return true;
        } else {
            const error = await response.text();
            console.error(`❌ Failed to delete ${repo}: ${response.status} - ${error}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ Error deleting ${repo}:`, error.message);
        return false;
    }
}

async function main() {
    if (!GITHUB_TOKEN) {
        console.error('❌ GITHUB_TOKEN is not set in the script!');
        process.exit(1);
    }

    console.log(`⚠️  About to delete ${repos.length} repositories!`);
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));

    let deleted = 0;
    let failed = 0;

    for (const repo of repos) {
        console.log(`🗑️  Deleting ${repo}...`);
        const success = await deleteRepo(repo);
        if (success) {
            deleted++;
        } else {
            failed++;
        }
        // Small delay between deletions
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✨ Done!`);
    console.log(`   ✅ Deleted: ${deleted}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log('='.repeat(60));
}

main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});