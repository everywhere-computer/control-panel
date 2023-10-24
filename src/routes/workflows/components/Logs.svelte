<script lang="ts">
  const statuses = [200, 404, 301]
  const methods = ['GET', 'PUT', 'POST', 'DELETE']
  const logs = [...Array(20).keys()].map((_, i) => ({
    time: new Intl.DateTimeFormat('en-US', {
      dateStyle: 'short',
      timeStyle: 'long'
    }).format(Date.now() - i * 1000),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    host: 'https://hello-world-shiny-star-f6bf.workflow.ipvm.dev',
    request: methods[Math.floor(Math.random() * methods.length)],
    message: 'Here is a relevant message'
  }))

  const STATUS_CODE_COLOURS = {
    200: 'bg-odd-green-200 text-odd-green-600',
    301: 'bg-odd-yellow-200 text-odd-gray-600',
    404: 'bg-odd-red-200 text-odd-red-600'
  }
</script>

<div class="w-full overflow-x-auto">
  <table class="table table-xs table-pin-rows table-pin-cols w-full">
    <thead>
      <tr
        class="bg-odd-gray-100 divide-x divide-odd-gray-0 border-t border-y-odd-gray-0"
      >
        <th class="bg-transparent" />
        <td class="bg-odd-gray-100 capitalize text-label-sm">Time</td>
        <td class="bg-odd-gray-100 capitalize text-label-sm">Status</td>
        <td class="bg-odd-gray-100 capitalize text-label-sm">Request</td>
        <td class="bg-odd-gray-100 capitalize text-label-sm">Host</td>
        <td class="bg-odd-gray-100 capitalize text-label-sm">Message</td>
      </tr>
    </thead>
    <tbody class="divide-y divide-odd-gray-200 border-t border-y-odd-gray-200">
      {#each logs as log, i}
        <tr
          class="bg-odd-gray-0 text-input-m group transition-colors duration-200 ease-in-out hover:bg-odd-yellow-200"
        >
          <th
            class="px-4 bg-clip-padding text-center transition-colors duration-200 ease-in-out bg-transparent group-hover:bg-odd-yellow-200"
          >
            {i + 1}
          </th>
          <td
            class="transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-yellow-200 border-l border-x-odd-gray-0"
          >
            {log.time}
          </td>
          <td
            class="transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-yellow-200 text-center border-l border-x-odd-gray-0"
          >
            <span
              class="{STATUS_CODE_COLOURS[
                log.status
              ]} px-1 rounded-sm text-input-sm"
            >
              {log.status}
            </span>
          </td>
          <td
            class="transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-yellow-200 text-center border-l border-x-odd-gray-0"
          >
            {log.request}
          </td>
          <td
            class="transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-yellow-200 border-l border-x-odd-gray-0"
          >
            {log.host}
          </td>
          <td
            class="transition-colors duration-200 ease-in-out bg-odd-gray-0 group-hover:bg-odd-yellow-200 border-l border-x-odd-gray-0"
          >
            {log.message}
          </td>
        </tr>
      {/each}
    </tbody>
    <!-- <tfoot>
      <tr>
        <th />
        <td>Time</td>
        <td>Status</td>
        <td>Host</td>
        <td>Request</td>
        <td>Message</td>
        <th />
      </tr>
    </tfoot> -->
  </table>
</div>
