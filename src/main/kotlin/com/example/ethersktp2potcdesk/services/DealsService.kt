package com.example.ethersktp2potcdesk.services

import OTCDesk
import com.example.ethersktp2potcdesk.models.Deal
import io.ethers.core.types.Address
import io.ethers.core.types.BlockId
import io.ethers.providers.Provider
import org.springframework.stereotype.Service
import java.math.BigInteger

@Service
class DealsService {
    fun fetchAllDeals(): List<Deal> {
        val provider = Provider.fromUrl("https://base.llamarpc.com").unwrap()
        val contractOtcDesk = OTCDesk(provider, Address("0x4038cf00104d62d7948aa2F246a47F12e90C2Be6"))

        val deals = mutableListOf<Deal>()
        val dealCount = contractOtcDesk.dealCount().call(BlockId.LATEST).sendAwait().unwrap()
        var index = dealCount.toInt()
        while (index > 0) {
            val dealResult =
                contractOtcDesk.deals(BigInteger(index.toString())).call(BlockId.LATEST).sendAwait().unwrap()
            deals.add(dealResultToDeal(index.toBigInteger(), dealResult))
            index-=1
        }

        return deals
    }

    private fun dealResultToDeal(dealId: BigInteger, dealResult: OTCDesk.DealsResult): Deal {
        return Deal(
            dealId,
            dealResult.userA.toString(),
            dealResult.userB.toString(),
            dealResult.tokenA.toString(),
            dealResult.tokenB.toString(),
            dealResult.amountA,
            dealResult.amountB,
            dealResult.userADeposited,
            dealResult.userBDeposited,
        )
    }
}